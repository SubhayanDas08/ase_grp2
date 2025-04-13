"""
FastAPI application providing traffic congestion and weather predictions using pre-trained models.

This module defines:
    1. Two Pydantic data models (CongestionRequest, WeatherRequest) for request validation.
    2. A ModelHost class for loading models, data, and performing predictions.
    3. Two FastAPI endpoints:
       - /predict/trafficCongestion for traffic congestion index predictions.
       - /predict/weatherPred for weather predictions (temperature, humidity, wind speed, pressure).
"""

from fastapi import FastAPI, HTTPException
import uvicorn
from pydantic import BaseModel
import pandas as pd
import joblib
from geopy.distance import geodesic
import requests
import numpy as np
from openai import OpenAI
import json
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
import datetime
import ast


load_dotenv()

# Store the OpenRouter API key in a variable – use the same key name as in your .env file
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
AQI_API_KEY = os.getenv("AQI_API_KEY")

class CongestionRequest(BaseModel):
    """
    Schema for incoming JSON requests (traffic congestion).

    Attributes:
        latitude  (float):  Latitude of the location.
        longitude (float):  Longitude of the location.
        hour      (int):    Hour of the day (0-23).
        month     (int):    Month (1-12).
        day       (int):    Day of the month (1-31).
    """
    latitude: float
    longitude: float
    hour: int
    month: int
    day: int


class WeatherRequest(BaseModel):
    """
    Schema for incoming JSON requests (weather prediction).

    Attributes:
        latitude  (float):  Latitude of the location.
        longitude (float):  Longitude of the location.
        hour      (int):    Hour of the day (0-23).
        month     (int):    Month (1-12).
        day       (int):    Day of the month (1-31).
    """
    latitude: float
    longitude: float
    hour: int
    month: int
    day: int

class FleetRequest(BaseModel):
    month: int

class AQIandTrafficCongestion(BaseModel):
    place: str

class TrashPickupRecommendation(BaseModel):
    route_id: str

class ModelHost:
    """
    Encapsulates model loading, data loading, and inference logic.
    """

    def __init__(self):
        """
        Initialize the ModelHost by loading the trained models, preprocessors, and supporting data.
        """

        # ---------------------------
        # Weather Prediction Setup
        # ---------------------------
        self.weather_prediction_model = joblib.load(
            "./models/weather_pred/model.joblib"
        )
        self.weather_prediction_preprocessor = joblib.load(
            "./models/weather_pred/preprocessor.joblib"
        )
        self.weather_dataset = pd.read_csv("./data/weather_pred/Additional Features.csv")
        self.weather_location_df = pd.read_csv("./data/weather_pred/Final_lat_long.csv")

        # ---------------------------
        # Traffic Congestion Setup
        # ---------------------------
        self.traffic_congestion_model = joblib.load(
            "./models/traffic_congestion/model.joblib"
        )
        self.traffic_congestion_preprocessor = joblib.load(
            "./models/traffic_congestion/preprocessor.joblib"
        )
        self.traffic_dataset = pd.read_csv("./data/traffic_congestion/Additional Features Final v1.csv")
        self.traffic_location_df = pd.read_csv("./data/traffic_congestion/Final Lat Longl v1.csv")

        
        # ---------------------------
        # Fleet Recommendation Setup
        # ---------------------------
        self.fleet_df = pd.read_csv("./data/fleet_recommendation/Monthly_Data.csv")
        self.fleet_df['Passenger-to-Bus Ratio'] = self.fleet_df['Number of passengers'] / self.fleet_df['Number of buses']

        # ---------------------------
        # Trash Pickup Recommendation Setup
        # ---------------------------
        self.trashpickuproutes = pd.read_csv("./data/trash_pickup_recommendation/routes.csv")
        self.trashpickupcoordinates = pd.read_csv("./data/trash_pickup_recommendation/place_coordinates.csv")
        self.TRAFFIC_API_URL = "http://127.0.0.1/predict/trafficCongestion"
        self.AQI_API_URL_TEMPLATE = "http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={api_key}"


    def get_params(self, query_params: dict):
        """
        Extract and validate parameters from the request dictionary.

        Args:
            query_params (dict): Dictionary containing keys:
                'latitude', 'longitude', 'hour', 'month', 'day'.

        Returns:
            tuple: (latitude, longitude, hour, month, day) all as the correct types.
        """
        longitude = float(query_params["longitude"])
        latitude = float(query_params["latitude"])
        hour = int(query_params["hour"])
        month = int(query_params["month"])
        day = int(query_params["day"])
        return latitude, longitude, hour, month, day

    def get_fleet_recommendation_params(self, query_params: dict):

        month = int(query_params["month"])

        return month
    
    def get_recommendations(self, month):
        month_data = self.fleet_df[self.fleet_df['Month'] == month]
        
        city_day_ratios = month_data.groupby(['Bus City Services', 'Day of Week'])['Passenger-to-Bus Ratio'].mean().reset_index()
        city_day_totals = month_data.groupby(['Bus City Services', 'Day of Week'])['Number of passengers'].sum().reset_index()
        
        city_day_recommendations = pd.merge(city_day_ratios, city_day_totals, on=['Bus City Services', 'Day of Week'])
        
        city_day_recommendations['Recommended Buses'] = city_day_recommendations['Number of passengers'] / city_day_recommendations['Passenger-to-Bus Ratio']
        
        city_totals = city_day_recommendations.groupby('Bus City Services')['Recommended Buses'].sum().reset_index()

        np.random.seed(month)  # Ensure consistency for each month
        variability_factor = np.random.uniform(0.9, 1.1, size=city_totals.shape[0])  # Random variability between 90% and 110%
        city_totals['Varied Recommended Buses'] = city_totals['Recommended Buses'] * variability_factor
        
        total_recommended_buses = city_totals['Varied Recommended Buses'].sum()
        scaling_factor = 711 / total_recommended_buses
        city_totals['Scaled Recommended Buses'] = city_totals['Varied Recommended Buses'] * scaling_factor
        
        city_totals['Scaled Recommended Buses'] = city_totals['Scaled Recommended Buses'].round().astype(int)
        
        remainder = 711 - city_totals['Scaled Recommended Buses'].sum()
        
        while remainder != 0:
            if remainder > 0:
                city_totals.loc[city_totals['Varied Recommended Buses'].idxmax(), 'Scaled Recommended Buses'] += 1
                remainder -= 1
            elif remainder < 0:
                city_totals.loc[city_totals['Varied Recommended Buses'].idxmin(), 'Scaled Recommended Buses'] -= 1
                remainder += 1

        return city_totals[['Bus City Services', 'Scaled Recommended Buses']]
    

    def generate_dialogue_recommendations(self, recommendations, month_input): 
        # List of month names to map month numbers
        month_names = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ]   
        # Map the month number to month name
        month_name = month_names[month_input - 1]  # Adjust for zero-based index
        
        # Format the recommendations into a dialogue format
        dialogue = f"Based on your input for month {month_name}, here are the bus distribution recommendations:\n"
        for _, row in recommendations.iterrows():
            dialogue += f"In {row['Bus City Services']}, it is recommended to deploy {row['Recommended Buses']} buses.\n"
                    
        # Instantiate the OpenAI client with the OpenRouter API details
        openai_client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=OPENROUTER_API_KEY,  # Use the API key stored in the variable
        )
        
        # Build the messages list with separate system and user messages
        messages = [
            {"role": "system", "content": "You are a mediator. You need to rephrase the context given in a manner that these are recommendations for the new bus allotments which will make it more sustainable."},
            {"role": "user", "content": dialogue}
        ]
        
        
        # Create the chat completion using the OpenAI client
        completion = openai_client.chat.completions.create(
            model="openai/gpt-4o",
            extra_body={
                "models": ["anthropic/claude-3.5-sonnet", "gryphe/mythomax-l2-13b"],
            },
            messages=messages
        )
        
        # Attempt to extract and return the response message from the completion
        try:
            response_message = completion.choices[0].message.content
            return response_message
        except Exception as e:
            print("Error fetching response:", e)
            return "Error fetching the response"

    def nearest_location(self, location_df: pd.DataFrame, latitude: float, longitude: float):
        """
        Find the nearest location from `location_df` to the given (latitude, longitude).

        Args:
            location_df (pd.DataFrame): DataFrame containing columns 'Lat' and 'Long'.
            latitude (float):  Latitude of the user-provided location.
            longitude (float): Longitude of the user-provided location.

        Returns:
            tuple: (nearest_lat, nearest_long)
        """
        user_location = (latitude, longitude)
        min_distance = float('inf')
        nearest_point = None

        for _, row in location_df.iterrows():
            point = (row['Lat'], row['Long'])
            distance = geodesic(user_location, point).kilometers
            if distance < min_distance:
                min_distance = distance
                nearest_point = point

        return nearest_point

    def add_features(self, lat: float, long: float, hour: int, month: int, day: int, dataset: pd.DataFrame) -> pd.DataFrame:
        """
        Retrieve additional features based on the nearest location and merge with input data.

        Args:
            lat   (float): Latitude of the nearest known location.
            long  (float): Longitude of the nearest known location.
            hour  (int):   Hour of the day (0-23).
            month (int):   Month (1-12).
            day   (int):   Day of the month (1-31).
            dataset (pd.DataFrame): Additional features DataFrame to merge.

        Returns:
            pd.DataFrame: A DataFrame combining user input and matched features from the dataset.
        """
        # Create a DataFrame for the incoming location/time data.
        input_df = pd.DataFrame([{
            'Lat': lat,
            'Long': long,
            'Hour': hour,
            'Day': day,
            'Month': month
        }])

        # Filter rows in the dataset for the exact matching lat-long pair.
        feature_df = dataset[
            (dataset['Lat'] == lat) & (dataset['Long'] == long)
        ]

        feature_df = feature_df.reset_index(drop=True)

        # If no rows match, raise an error.
        if feature_df.empty:
            raise ValueError(f"No feature data found for location ({lat}, {long}).")

        # Drop Lat/Long from the features since they're already in input_df.
        feature_df = feature_df.drop(['Lat', 'Long'], axis=1)

        # Convert feature columns to object type if required by your pipeline.
        feature_df = feature_df.astype(object)

        # Combine user input with feature data.
        complete_df = pd.concat([input_df, feature_df], axis=1)

        # Fill any missing values with 0.
        complete_df.fillna(0, inplace=True)
        return complete_df

    def predict_traffic_congestion(self, input_data: dict):
        """
        Generate a congestion index prediction based on input parameters.

        Args:
            input_data (dict): Should contain keys:
                'latitude', 'longitude', 'hour', 'month', 'day'.

        Returns:
            np.ndarray: The predicted congestion index (array).
        """
        print("Entered predict_traffic_congestion method")

        # Extract validated parameters.
        latitude, longitude, hour, month, day = self.get_params(input_data)

        # Find the nearest location from the traffic dataset's location DataFrame.
        nearest_lat, nearest_long = self.nearest_location(self.traffic_location_df, latitude, longitude)

        # Create a DataFrame for prediction features.
        df = self.add_features(nearest_lat, nearest_long, hour, month, day, self.traffic_dataset)


        # Transform the DataFrame using the preprocessor.
        transformed_data = self.traffic_congestion_preprocessor.transform(df)

        # Predict using the LightGBM model.
        congestion_index = self.traffic_congestion_model.predict(transformed_data)

        return congestion_index

    def predict_weather(self, input_data: dict):
        """
        Generate weather predictions (temperature, humidity, wind speed, pressure) based on input parameters.

        Args:
            input_data (dict): Should contain keys:
                'latitude', 'longitude', 'hour', 'month', 'day'.

        Returns:
            np.ndarray: The predicted values (array of shape [n_samples, 4]).
        """
        print("Entered predict_weather method")

        # Extract validated parameters.
        latitude, longitude, hour, month, day = self.get_params(input_data)
        print(f"Extracted Parameters => Lat: {latitude}, Long: {longitude}, "
              f"Hour: {hour}, Month: {month}, Day: {day}")

        # Find the nearest location from the weather dataset's location DataFrame.
        nearest_lat, nearest_long = self.nearest_location(self.weather_location_df, latitude, longitude)
        print(f"Nearest Location => ({nearest_lat}, {nearest_long})")

        # Create a DataFrame for prediction features.
        df = self.add_features(nearest_lat, nearest_long, hour, month, day, self.weather_dataset)


        # Transform the DataFrame using the weather preprocessor.
        transformed_data = self.weather_prediction_preprocessor.transform(df)
        print("Weather preprocessor transformation complete.")

        # Predict using the LightGBM model (multi-output).
        # Likely returns shape (1, 4) if you're predicting for one sample.
        pred = self.weather_prediction_model.predict(transformed_data)
        print("Weather prediction successful:", pred)

        return pred
    
    def get_fleet_size(self, input_data:dict):

        month = self.get_fleet_recommendation_params(input_data)

        recommendations = self.get_recommendations(month)
        recommendations = recommendations.rename(columns={"Scaled Recommended Buses" : "Recommended Buses"})
        dialogue_response = self.generate_dialogue_recommendations(recommendations, month)

        return (recommendations, dialogue_response)

    def get_traffic_congestion(self, lat, lon):
        now = datetime.datetime.now()
        payload = {
            "latitude": lat,
            "longitude": lon,
            "hour": now.hour,
            "month": now.month,
            "day": now.day
        }
        try:
            response = self.predict_traffic_congestion(payload)
            response = response[0]
            return response
        except (requests.RequestException, KeyError, IndexError) as e:
            print(f"[Traffic] Error fetching congestion for ({lat}, {lon}): {e}")
            return 1  # Default value in case of error
    
    def get_air_pollution(self, lat, lon):
        url = self.AQI_API_URL_TEMPLATE.format(lat=lat, lon=lon, api_key=AQI_API_KEY)
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()["list"][0]["main"]["aqi"]
        except (requests.RequestException, KeyError, IndexError) as e:
            print(f"[AQI] Error fetching AQI for ({lat}, {lon}): {e}")
            return 1

    def get_AQI_TC(self, place_name):
        match = self.trashpickupcoordinates[self.trashpickupcoordinates["Place Name"] == place_name]
        lat = match.iloc[0]["Latitude"]
        lon = match.iloc[0]["Longitude"]
        
        tc = self.get_traffic_congestion(lat, lon)
        aqi = self.get_air_pollution(lat, lon)

        return (aqi, tc)
    
    def get_list_of_AQI_TC(self, route_id):
        
        row = self.trashpickuproutes[self.trashpickuproutes["route_id"] == route_id]

        results = []

        pickup_data = row.iloc[0].get("place_pickup_times")
        if isinstance(pickup_data, str):
            pickup_data = ast.literal_eval(pickup_data)

        for entry in pickup_data:
            place = entry.get("place")
            pickup_time = entry.get("pickup_time")
            match = self.trashpickupcoordinates[self.trashpickupcoordinates["Place Name"] == place]
            lat = match.iloc[0]["Latitude"]
            lon = match.iloc[0]["Longitude"]
            
            if lat is None or lon is None:
                results.append({
                    "Place": place,
                    "Pickup Time": pickup_time,
                    "Error": "Coordinates not found"
                })
                continue
            
            aqi, congestion = self.get_AQI_TC(place)

            # Convert NumPy types to native Python types
            results.append({
                "place": place,
                "aqi": float(aqi) if hasattr(aqi, "item") else aqi,
                "tc": float(congestion) if hasattr(congestion, "item") else congestion
            })

        return results
        
    def collect_route_data(self, row):
        results = []

        pickup_data = row.iloc[0].get("place_pickup_times")
        if isinstance(pickup_data, str):
            pickup_data = ast.literal_eval(pickup_data)

        for entry in pickup_data:
            place = entry.get("place")
            pickup_time = entry.get("pickup_time")
            match = self.trashpickupcoordinates[self.trashpickupcoordinates["Place Name"] == place]
            lat = match.iloc[0]["Latitude"]
            lon = match.iloc[0]["Longitude"]
            
            if lat is None or lon is None:
                results.append({
                    "Place": place,
                    "Pickup Time": pickup_time,
                    "Error": "Coordinates not found"
                })
                continue
            
            aqi, congestion = self.get_AQI_TC(place)

            results.append({
                "Place": place,
                "Pickup Time": pickup_time,
                "AQI": aqi,
                "Traffic Congestion": congestion
            })

        return results
    
    def analyze_pickup_route(self, results):
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=OPENROUTER_API_KEY
        )

        dialogue = (
            "You are a route optimization assistant for waste management. "
            "You are given a list of pickup places along with their AQI (Air Quality Index) and Traffic Congestion level.\n"
            "- AQI scale: 1 (Good) to 5 (Very Poor)\n"
            "- Traffic Congestion: 1 (Smooth) to 5 (Heavily Congested)\n\n"
            "Your task:\n"
            "1. Determine if the pickup route is acceptable as-is.\n"
            "2. If not, list places that should be avoided and explain why.\n"
            "3. Provide a summary at the beginning.\n\n"
            "Here is the data:\n"
        )

        for item in results:
            if "Error" in item:
                dialogue += f"- {item['Place']}: Error - {item['Error']}\n"
            else:
                dialogue += f"- {item['Place']}: AQI = {item['AQI']}, Traffic Congestion = {item['Traffic Congestion']}\n"

        messages = [
            {"role": "system", "content": "You are an expert in environmental route optimization."},
            {"role": "user", "content": dialogue}
        ]

        try:
            completion = client.chat.completions.create(
                model="meta-llama/llama-3-8b-instruct",
                extra_body={
                    "models": [
                        "meta-llama/llama-3-8b-instruct",
                        "openai/gpt-4o",
                        "gryphe/mythomax-l2-13b"
                    ]
                },
                messages=messages
            )
            print("\n===== Route Analysis =====\n")
            print(completion.choices[0].message.content)
            return completion.choices[0].message.content
        except Exception as e:
            print("Error fetching response from OpenRouter:", e)

    def get_trash_pickup_recommendation(self, id):

        # Get row by ID
        row = self.trashpickuproutes[self.trashpickuproutes["route_id"] == id]
        results = self.collect_route_data(row)
        recommendation = self.analyze_pickup_route(results)

        return recommendation


# Create the FastAPI application.
# Initialize FastAPI app
app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Instantiate a single ModelHost object (loads models & data once at startup).
model_host = ModelHost()


@app.post("/predict/trafficCongestion")
async def predict_traffic_congestion(request: CongestionRequest):
    """
    Endpoint for generating a traffic congestion index prediction.

    Args:
        request (CongestionRequest): Contains latitude, longitude, hour, month, and day.

    Returns:
        dict: A dictionary with the predicted congestion index.
    """
    try:
        # Convert the request Pydantic model to a dictionary for the model host.
        input_data = {
            'latitude': request.latitude,
            'longitude': request.longitude,
            'hour': request.hour,
            'month': request.month,
            'day': request.day,
        }

        # Perform inference.
        congestion_index = model_host.predict_traffic_congestion(input_data)
        print("Congestion Index:", congestion_index)

        # Return the prediction in JSON format.
        return {"congestion_index": congestion_index.tolist()}

    except Exception as e:
        print(f"Error during traffic congestion prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/weatherPred")
async def predict_weather(request: WeatherRequest):
    """
    Endpoint for generating weather predictions (temperature, humidity, wind speed, pressure).

    Args:
        request (WeatherRequest): Contains latitude, longitude, hour, month, and day.

    Returns:
        dict: A dictionary with the predicted weather values.
    """
    try:
        # Convert the request Pydantic model to a dictionary for the model host.
        input_data = {
            'latitude': request.latitude,
            'longitude': request.longitude,
            'hour': request.hour,
            'month': request.month,
            'day': request.day,
        }

        # Perform inference using the ModelHost.
        # Expecting shape (1, 4) from our multi-output model.
        pred = model_host.predict_weather(input_data)
        print("Weather Predictions:", pred)

        # Since 'pred' can be a 2D array (e.g., [[8.03, 75.76, 22.32, 1008.05]]),
        # handle the indexing accordingly.
        # For a single prediction, we can do pred[0] => [8.03, 75.76, 22.32, 1008.05]
        result = pred[0]

        return {
            "temperature": float(result[0]),
            "humidity": float(result[1]),
            "wind_speed": float(result[2]),
            "pressure": float(result[3])
        }

    except Exception as e:
        print(f"Error during weather prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/fleetsize")
async def get_fleet_size_recommendations(request: FleetRequest):
    try:
        # Convert the request Pydantic model to a dictionary for the model host.
        input_data = {
            'month': request.month
        }

        recommendations, dialogue_response = model_host.get_fleet_size(input_data)
        
        # Convert recommendations DataFrame to a dictionary (which can be serialized by FastAPI)
        recommendations_dict = recommendations.to_dict(orient="records")

        print("Recommendations:", recommendations_dict)
        print("Dialogue:", dialogue_response)

        return {
            "recommendations": recommendations_dict,  # Use dictionary format for serialization
            "dialogue": dialogue_response  # Return the dialogue string
        }

    except Exception as e:
        print(f"Error during getting recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/recommend/trashpickup")
async def get_trash_pickup_recommendations_API(request: TrashPickupRecommendation):
    try:
        # Convert the request Pydantic model to a dictionary for the model host.
        id = request.route_id
        recommendation = model_host.get_trash_pickup_recommendation(id)
        

        print("Recommendations:", recommendation)

        return {
            "recommendations": recommendation
        }

    except Exception as e:
        print(f"Error during getting recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/AQI_TC")
async def get_AQI_TC_API(request: TrashPickupRecommendation):
    try:
        route_id = str(request.route_id)
        
        route_with_AQI_TC = model_host.get_list_of_AQI_TC(route_id)

        return route_with_AQI_TC

    except Exception as e:
        print(f"Error during getting AQI and Traffic Congestion: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    


# For development/debugging:
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)