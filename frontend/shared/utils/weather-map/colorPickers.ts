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

