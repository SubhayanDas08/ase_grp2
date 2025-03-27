import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authenticatedGet } from "../utils/auth";

interface EventData {
    name: string;
    event_date: string;
    event_time: string;
    location: string;
    area: string;
    description: string;
}

export default function ViewEvent():JSX.Element {
    const {id}=useParams();    
    const navigate=useNavigate();
    const [event,setEvent]=useState<EventData | null>(null);

    useEffect(()=>{
        const fetchEvent=async()=>{
            try {
                const response = await authenticatedGet<EventData>(`/events/${id}`);              
                console.log(response);
                setEvent(response || null);
            } catch (error) {
                console.error("Error fetching the event",error);
            }
        }
        fetchEvent();
    },[id]);
        
    return (
        <div className="w-full h-full">
                    <div className="flex">
                    <h2 className="text-5xl mb-10 font-extrabold primaryColor1">
                    <span className="cursor-pointer border-b-5 border-primaryColor1 pb-0.6" onClick={()=>navigate("/events/")}>Events</span> {">"} View Event</h2>
                    </div>
                    <div className="h-full w-full flex flex-col space-y-3">
        
                    {/* Event Name */}
                    <div className="">
                        <h3 className="text-2xl font-extrabold primaryColor1">Event Name</h3>
                        <div className="textFieldBGDark border-gray-100 w-full mt-2 rounded-md h-10 px-4 py-2 textDark">
                            {event?.name}
                        </div>
                    </div>
        
                    {/* Event Details */}
                    <div className="space-y-3">
        
                            <div className="flex justify-between">

                                {/* Date of Event*/}
                                <div className="min-w-[50%]">
                                    <h3 className="text-2xl font-extrabold primaryColor1">Date</h3>
                                    <div className="textFieldBGDark border-gray-100 w-[50%] mt-2 rounded-md px-4 py-2 textDark">
                                    {event?.event_date ? new Date(event.event_date).toLocaleDateString() : "N/A"}
                                    </div>
                                </div>
        
                                {/* Time of Event */}
                                <div className="min-w-[50%]">
                                    <h3 className="text-2xl font-extrabold primaryColor1">Time</h3>
                                    <div className="textFieldBGDark border-gray-100 w-[50%] mt-2 rounded-md px-4 py-2 textDark">
                                    {event?.event_time ? new Date(event.event_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}
                                </div>
                            </div>
                            </div>
        
                            <div className="flex justify-between">
                                {/* Location of Event */}
                                <div className="min-w-[50%]">
                                    <h3 className="text-2xl font-extrabold primaryColor1">Location</h3>
                                    <div className="textFieldBGDark border-gray-100 w-[50%] mt-2 rounded-md px-4 py-2 h-10 textDark">
                                        {event?.location}
                                    </div>
                                </div>
        
                                {/* Area of Event */}
                                <div className="min-w-[50%]">
                                    <h3 className="text-2xl font-extrabold primaryColor1">Area</h3>
                                    <div className="textFieldBGDark border-gray-100 w-[50%] mt-2 rounded-md px-4 py-2 h-10 textDark">
                                        {event?.area}
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        {/* Event Description */}
                        <div className="flex flex-col h-50 ">
                        <h3 className="text-2xl font-extrabold primaryColor1">Event Description</h3>
                        <div className="textFieldBGDark p-4 rounded-md h-50 mt-2">
                            {event?.description}
                        </div>
                        </div>
        
                        {/* Delete Button */}
                        {/* <button className="flex items-center justify-center h-12 w-36 font-extrabold rounded-2xl textLight primaryGradient hover:cursor-pointer"
                        onClick={handleAddEvent}>
                            Add Event
                        </button> */}
                    
                    </div>
                </div>
    )
}