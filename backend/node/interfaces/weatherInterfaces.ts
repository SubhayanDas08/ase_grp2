export interface Station {
    uid: number;
    lat: number;
    lon: number;
    station: { name: string };
}

export interface AQIStationsResponse {
    status: string;
    data: Station[];
}
export interface WeatherData {
    location: {
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        tz_id: string;
        localtime: string;
    };
    current: {
        temp_c: number;
        feelslike_c: number;
        wind_kph: number;
        humidity: number;
        precip_mm: number;
        uv: number;
        dewpoint_c?: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
    };
}