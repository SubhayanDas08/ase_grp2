import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBolt } from "react-icons/fa";

interface FailteEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  location: {
    name: string;
    address?: {
      addressRegion?: string;
      addressCountry?: string;
    };
    geo?: {
      latitude: number;
      longitude: number;
    };
  };
  eventSchedule?: {
    startDate?: string;
    startTime?: string;
  }[];
}

export default function FailteEvents(): JSX.Element {
  const navigate = useNavigate();
  const [events, setEvents] = useState<FailteEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://failteireland.azure-api.net/opendata-api/v2/events", {
          headers: {
            "Ocp-Apim-Subscription-Key": "988e6458483340cd8599cacbbe75acb3",
          },
        });

        const data = await response.json();
        console.log("API response:", data);

        const dublinEvents = (data?.value || []).filter((event: FailteEvent) => {
            const region = event.location?.address?.addressRegion?.toLowerCase();
            const name = event.location?.name?.toLowerCase();
            return region === "dublin" || name === "dublin";
          });
          setEvents(dublinEvents);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching Fáilte Ireland events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mainHeaderHeight w-full flex items-center justify-between">
        <div className="titleText primaryColor1">Suggested Events</div>
      </div>

      <div className="h-full w-full flex flex-col space-y-3 overflow-auto pr-2">
        {loading ? (
          <div className="text-center mt-10 text-gray-500">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center mt-10 text-gray-500">No events available.</div>
        ) : (
          events.map((event) => {
            const formattedDate =
              event.startDate && !isNaN(Date.parse(event.startDate))
                ? new Date(event.startDate).toLocaleDateString("en-IE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "No date";

            return (
              <div
                key={event.id}
                className="flex items-center h-20 rounded-3xl primaryGradient hover:cursor-pointer"
                onClick={() => {
                  console.log("Clicked event:", event.id);
                }}
              >
                <div className="h-14 w-14 ml-5 flex items-center justify-center rounded-full bg-white">
                  <FaBolt className="text-2l" />
                </div>
                <div className="ml-10 flex flex-col overflow-hidden">
                  <div className="text-lg font-semibold textLight truncate">{event.name}</div>
                  <div className="textLight text-sm truncate">
                    {event.location?.name || "Unknown"},{" "}
                    {event.location?.address?.addressRegion || ""}
                  </div>
                </div>
                <div className="flex justify-end grow mr-10 font-bold textLight text-sm">
                  {formattedDate}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}