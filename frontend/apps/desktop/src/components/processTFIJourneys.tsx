interface Coordinate {
    latitude: number;
    longitude: number;
  }
  
  interface Stop {
    coordinate: Coordinate;
    name?: string;
    departure?: string;
    departureRealTime?: string;
    arrival?: string;
    arrivalRealTime?: string;
  }
  
  interface Leg {
    duration: string;
    mode: string;
    serviceNumber?: string;
    origin: Stop;
    destination: Stop;
    intermediateStops?: Stop[];
  }
  
  interface Journey {
    legs: Leg[];
    modes: string[];
  }
  
  interface ProcessedStop {
    position: [number, number];
    name: string;
    time: string;
    serviceNumber: string;
    mode: string;
  }
  
  interface Route {
    coordinates: [number, number][];
    mode: string;
    serviceNumber: string;
  }
  
  interface ProcessedJourneyData {
    stops: ProcessedStop[];
    routes: Route[];
    descriptions: string[];
    legDurations: number[][];
  }
  
  export default function processTFIJourneys (journeys: Journey[]): ProcessedJourneyData {
    const stops: ProcessedStop[] = [];
    const routes: Route[] = [];
    const descriptions: string[] = [];
    const legDurations: number[][] = [];
  
    journeys.slice(0, 3).forEach((journey) => {
      const journeyStops: ProcessedStop[] = [];
      const journeyLegDurations: number[] = [];
      let description: string = '';
      //console.log(journey);
      journey.legs.forEach((leg, index) => {
        // Duration calculation 
        //console.log(leg);
        const durationMatch = leg.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const hours = parseInt(durationMatch?.[1] || '0');
        const minutes = parseInt(durationMatch?.[2] || '0');
        const seconds = parseInt(durationMatch?.[3] || '0');
        const totalMinutes = (hours * 60 + minutes + seconds / 60).toFixed(1);
  
        // Stop processing
        const processStop = (stopData: Stop, type: 'origin' | 'destination'): ProcessedStop => ({
          position: [stopData.coordinate.latitude, stopData.coordinate.longitude],
          name: stopData.name || `${type} Point ${index + 1}`,
          time: stopData[type === 'origin' ? 'departureRealTime' : 'arrivalRealTime'] || stopData[type === 'origin' ? 'departure' : 'arrival'] || '',
          serviceNumber: leg.serviceNumber || "N/A",
          mode: leg.mode
        });
  
        // Add origin, intermediate, and destination stops
        journeyStops.push(processStop(leg.origin, 'origin'));
  
        if (leg.intermediateStops) {
          leg.intermediateStops.forEach(stop => 
            journeyStops.push({
              position: [stop.coordinate.latitude, stop.coordinate.longitude],
              name: stop.name || "Intermediate Stop",
              time: stop.arrivalRealTime || stop.arrival || '',
              serviceNumber: leg.serviceNumber || "N/A",
              mode: leg.mode
            })
          );
        }
  
        journeyStops.push(processStop(leg.destination, 'destination'));
  
        // Build leg description
        const legDescription: Record<string, string> = {
          'TRAM': `Tram ${leg.serviceNumber || ''}: ${leg.origin.name} → ${leg.destination.name} (${totalMinutes} mins)`,
          'BUS': `Bus ${leg.serviceNumber || ''}: ${leg.origin.name} → ${leg.destination.name} (${totalMinutes} mins)`,
          'WALK': `Walk: ${leg.origin.name} → ${leg.destination.name} (${totalMinutes} mins)`,
          'RAIL': `Train ${leg.serviceNumber || ''}: ${leg.origin.name} → ${leg.destination.name} (${totalMinutes} mins)`
        };
  
        // Append leg description with a space if not the first leg
        const legDesc = legDescription[leg.mode] || `${leg.mode}: ${leg.origin.name} → ${leg.destination.name} (${totalMinutes} mins)`;
        description += (index > 0 ? ' ' : '') + legDesc;
        journeyLegDurations.push(parseFloat(totalMinutes));
      });
  
      //console.log("Start At", journey.legs[0].origin.departure);
      // Get departure time from first leg's origin
  
      const departureTime = journey.legs[0].origin.departure
        ? new Date(journey.legs[0].origin.departure).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Europe/Dublin'
          })
        : 'N/A';
      //console.log("Departure Time", departureTime);
  
      // Calculate total time for this journey
      const totalTime = journeyLegDurations.reduce((acc, time) => acc + time, 0).toFixed(1);
      // Create description with departure time
      const journeyDescription = `Leave at: ${departureTime} | ${description} | (Total journey time: ${totalTime} mins)`;
      descriptions.push(journeyDescription);
  
      // Collect processed data
      stops.push(...journeyStops);
      routes.push({
        coordinates: journeyStops.reduce<[number, number][]>((acc, stop) => {
          // Fixed line with proper parenthesis
          if (stop.position && Array.isArray(stop.position)) {
            acc.push([stop.position[0], stop.position[1]]);
          }
          return acc;
        }, []),
        mode: journey.modes[0] || 'BUS',
        serviceNumber: journey.legs.find(l => l.mode === 'BUS')?.serviceNumber || "N/A"
      });
      legDurations.push(journeyLegDurations);
    });
  
    return { stops, routes, descriptions, legDurations };
  };