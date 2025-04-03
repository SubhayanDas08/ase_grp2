declare module "react-leaflet-heatmap-layer" {
    import { LayerProps } from "react-leaflet";
    import { LatLngExpression } from "leaflet";
  
    export interface HeatmapLayerProps extends LayerProps {
      points: { lat: number; lng: number; intensity?: number }[];
      longitudeExtractor: (point: any) => number;
      latitudeExtractor: (point: any) => number;
      intensityExtractor: (point: any) => number;
      max?: number;
      radius?: number;
      blur?: number;
      minOpacity?: number;
    }
  
    const HeatmapLayer: React.FC<HeatmapLayerProps>;
    export default HeatmapLayer;
  }