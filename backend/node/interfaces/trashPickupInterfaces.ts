
export interface RouteDetailsResponse {
    id:number
    route_id: string;
    route_name: string;
    county: string;
    pickup_day: string;
    pickup_duration_min: number;
    num_stops: number;
    place_pickup_times: PickupTime[];
}

export interface PickupTime {
    place:string
    pickup_time: string;
}