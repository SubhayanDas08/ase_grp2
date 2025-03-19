const API_KEY="ae06a6ec11aa49f1a7905753250602"
const CITY="dublin"

const url=`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${CITY}`

// console.log(url);

const fetchWeather = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Weather Data:", data);

      const temperature=data.current.temp_c;
      const tempFeelsLike=data.current.feelslike_c;
      const windSpeed=data.current.wind_kph;
      const humidity=data.current.humidity;
      const precipitation=data.current.precip_mm;
      const uvIndex=data.current.uv;
      const dewpoint=data.current.dewpoint_c;

      console.log(temperature, tempFeelsLike, windSpeed, humidity, precipitation, uvIndex, dewpoint);
      
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  fetchWeather();