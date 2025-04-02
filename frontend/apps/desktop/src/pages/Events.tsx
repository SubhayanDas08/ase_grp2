import { FaBolt, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authenticatedGet } from "../utils/auth";
import { useEffect, useState } from "react";


interface Event {
    id: number;
    name: string;
    event_date: string;
    event_time: string;
    location: string;
    area: string;
    description: string;
  }
  
export default function Events2(): JSX.Element {
    const navigate=useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    
    useEffect(()=>{
        const fetchEvents=async ()=>{
            try {
                const data = await authenticatedGet<Event[]>("/events/");
                const now = new Date(); 
                console.log(now);
                

                const upcomingEvents = data.filter((event) => {
                    const normalizedDate = event.event_date.includes("T")
                    ? event.event_date.split("T")[0]
                    : event.event_date;
            
                const combinedDateTime = `${normalizedDate}T${event.event_time}`;            
                const eventDateTime = new Date(combinedDateTime);
                return eventDateTime >= now;
                 });

                const sortedEvents = upcomingEvents.sort((a, b) => {
                    const dateA = new Date(`${a.event_date}T${a.event_time}`);
                    const dateB = new Date(`${b.event_date}T${b.event_time}`);
                    return dateB.getTime() - dateA.getTime();
                });
                setEvents(sortedEvents);
            } catch (error) {
                console.error("Error fetching events",error);
            }
        }
        fetchEvents();
    },[]);

    return(
        <div className="w-full h-full flex flex-col">
            <div className="mainHeaderHeight w-full flex items-center justify-between">
                <div className="titleText primaryColor1">Events</div>
                <div className="flex h-fit w-fit items-center justify-end">
                    <div className="px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out primaryColor2BG text-white cursor-pointer"
                    onClick={()=>navigate("/events/add")}>
                        Add Event
                    </div>
                </div>
            </div>
            <div className="h-full w-full flex flex-col space-y-3">
            {events.map((event) => (
                // Event Card
                <div key={event.id} className="flex items-center h-24 rounded-3xl primaryGradient hover:cursor-pointer"
                onClick={()=>navigate(`/events/view/${event.id}`)}>
                    <div className="h-14 w-14 ml-5 flex items-center justify-center rounded-full bg-white">
                        <FaBolt className="text-2l" />
                    </div>
                    <div className="ml-10 flex flex-col">
                        <div className="text-lg font-semibold textLight">{event.name}</div>
                        <div className="textLight">{event.description}</div>
                        <div className="text-sm mt-2 textLight italic flex items-center"> 
                        <FaMapMarkerAlt className="mr-2 text-base" /> {/* Location icon */}
                        {event.location}
                        </div>
                    </div>
                    <div className="flex flex-col items-end grow mr-10 textLight">
                    <div className="italic">
                        {new Date(event.event_date).toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                    <div className="font-bold">
                        {event.event_time.slice(0, 5)}
                    </div>
                </div>
                </div>
            ))}

            </div>

        </div>
    );
}