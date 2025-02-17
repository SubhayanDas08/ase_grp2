export interface Route {
    distance: number;
    time: number;
    tollCost?: number;
    coordinates: [number, number][];
  }