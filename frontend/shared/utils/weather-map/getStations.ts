const access_token: string | undefined = import.meta.env.VITE_WAQI_ACCESS_TOKEN;

interface StationInfo {
  id: number;
  lat: number;
  lon: number;
}

interface StationData {
  status: string;
  data: {
    lat: number;
    lon: number;
    uid: number;
  }[];
}

export const getStations = async (bounds: string): Promise<StationInfo[]> => {
  if (!access_token) throw new Error("Missing access token");

  try {
    const url = `https://api.waqi.info/map/bounds?token=${access_token}&latlng=${bounds}`;
    const response = await fetch(url);

    if (!response.ok)
      throw new Error(`Failed to fetch stations: ${response.statusText}`);

    const stationsData: StationData = await response.json();

    return stationsData.data
      .filter((station) => station.uid && station.lat && station.lon)
      .map((station) => ({
        id: station.uid,
        lat: station.lat,
        lon: station.lon,
      }));
  } catch (error) {
    throw new Error("Error in fetching stations of the bound coordinates");
  }
};
