export const getColorByAqi = (aqi: number) => {
    if (aqi <= 25) return "darkgreen";
    if (aqi <= 50) return "green";
    if (aqi <= 75) return "yellow";
    if (aqi <= 100) return "orange";
    return "red";
  };

  export const getColorByTempC = (temp_c: number) => {
    if (temp_c <= -5) return "#0000FF";
    if (temp_c <= 2) return "#00D8FF";
    if (temp_c <= 10) return "#87CEEB";
    if (temp_c <= 20) return "#FFA500";
    if (temp_c <= 30) return "#FF4500";
    return "#FF0000";
  }; 

  export const getColorByWind = (speed: number) => {
    if (isNaN(speed)) return "gray";
    if (speed < 10) return "green";
    if (speed < 25) return "orange";
    return "red";
  }
  
  export const getColorByHumidity = (h: number) => {
    if (isNaN(h)) return "gray";
    if (h < 30) return "orange";
    if (h <= 60) return "green";
    return "blue";
  }
  
  export const getColorByPrecip = (p: number) => {
    if (isNaN(p)) return "gray";
    if (p === 0) return "lightgray";
    if (p < 2) return "lightblue";
    return "blue";
  }
  
  export const getColorByUv = (uv: number) => {
    if (isNaN(uv)) return "gray";
    if (uv < 3) return "green";
    if (uv < 6) return "yellow";
    if (uv < 8) return "orange";
    return "red";
  }
  