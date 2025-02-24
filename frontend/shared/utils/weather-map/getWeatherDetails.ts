const access_token: string | undefined = import.meta.env.VITE_WEATHER_API_ACCESS_TOKEN;

interface WeatherData {
  status: string;
  current: {
    temp_c: number;
    feelslike_c: number;
    wind_kph: number;
    humidity: number;
    precip_mm: number;
    uv: number;
    dewpoint_c?: number;
  };
}

export const getWeatherDetails = async (
  latitude: number,
  longitude: number,
): Promise<WeatherData["current"]> => {
  if (!access_token) throw new Error("Missing access token");

  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=${access_token}&q=${latitude},${longitude}`;
    const response = await fetch(url);

    if (!response.ok)
      throw new Error(
        `Failed to fetch weather deatils of Coordinates: ${latitude} & ${longitude}: ${response.statusText}`,
      );

    // console.log(await response.json());

    const weatherData: WeatherData = await response.json();
    console.log(weatherData);

    if (!weatherData.current) {
      throw new Error(
        `Invalid response structure for coordinates: ${latitude}, ${longitude}`,
      );
    }

    return weatherData.current;
  } catch (error) {
    throw new Error("Error in fetching AQI of stations");
  }
};
