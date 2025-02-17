export const fetchRoutes = async (start: [number, number], end: [number, number]) => {
    try {
      const response = await fetch(`https://api.example.com/getRoute?start=${start}&end=${end}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching routes:", error);
      return null;
    }
  };