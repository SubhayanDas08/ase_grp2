import { FaBolt } from "react-icons/fa";
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
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events",error);
            }
    }
    fetchEvents();
    },[]);

    return(
        <div className="w-full h-full">
            <div className="flex">
            <h2 className="text-5xl mb-10 font-extrabold primaryColor1">Events</h2>
            <div className="flex grow">
                <div className="flex justify-center items-center ml-auto mr-4 mt-4 mb-auto h-10 w-35 rounded-2xl primaryColor1BG font-semibold textLight hover:cursor-pointer"
                onClick={()=>navigate("/events/add")}>
                    + Add Event
                </div>
            </div>
            </div>

            <div className="h-full w-full flex flex-col space-y-3">
            {events.map((event) => (
                // Event Card
                <div key={event.id} className="flex items-center h-20 rounded-3xl primaryGradient hover:cursor-pointer"
                onClick={()=>navigate(`/events/view/${event.id}`)}>
                    <div className="h-14 w-14 ml-5 flex items-center justify-center rounded-full bg-white">
                        <FaBolt className="text-2l" />
                    </div>
                    <div className="ml-10 flex flex-col">
                        <div className="text-lg font-semibold textLight">{event.name}</div>
                        <div className="textLight">{event.description}</div>
                    </div>
                    <div className="flex justify-end grow mr-10 font-bold textLight">
                        {event.event_time}
                    </div>
                </div>
            ))}

            </div>

        </div>
    );
}