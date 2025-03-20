import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import { useState } from "react";
import { time } from "console";

interface SettingsProps {
    setUserAuthenticated: (userAuthenticated: any) => void;
  }
  
export default function AddEvent({setUserAuthenticated}:SettingsProps): JSX.Element {

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>('10:00');
        
    return(
        <div className="w-full h-full">
            <div className="flex">
            <h2 className="text-5xl mb-10 font-extrabold primaryColor1">Events {">"} Add Event</h2>
            </div>
            <div className="h-full w-full flex flex-col space-y-3 bg-amber-500">

            {/* Event Name */}
            <div className="">
                <h3 className="text-2xl font-extrabold primaryColor1">Event Name</h3>
                <input
                    type="text"
                    // value={subject}
                    placeholder="Add Name of the Event"
                    // onChange={(e)=>setSubject(e.target.value)}
                    className="textFieldBG w-full mt-4 rounded-2xl px-4 py-2 textDark"
                    />
            </div>

                {/* Event Details */}
                <div className="bg-indigo-300 space-y-3">

                    <div className="flex justify-between">
                        {/* Date of Event*/}
                        <div className="bg-amber-700 min-w-1/2">
                            <h3 className="text-2xl font-extrabold primaryColor1">Date of Event</h3>
                            <div className="relative w-full">
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date:Date | null) => setSelectedDate(date)}
                                dateFormat="dd/MM/yyyy"
                                className="p-2 border border-gray-300 rounded-md"
                                placeholderText="Select Date of the Event"
                                />
                            </div>
                        </div>

                        {/* Time of Event */}
                        <div className="bg-pink-400">
                            <h3 className="text-2xl font-extrabold primaryColor1">Time</h3>
                            <div className="bg-red-50">
                            <TimePicker onChange={(time:string|null)=>setSelectedTime(time)}/>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        {/* Location of Event */}
                        <div>
                            <h3 className="text-2xl font-extrabold primaryColor1">Location</h3>
                            <div className="h-7 w-50 bg-red-50">
                            </div>
                        </div>

                        {/* City of Event */}
                        <div>
                            <h3 className="text-2xl font-extrabold primaryColor1">City</h3>
                            <div className="h-7 w-50 bg-red-50">
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Description */}
                <div className="flex flex-col h-50 ">
                <h3 className="text-2xl font-extrabold primaryColor1">Event Description</h3>
                <textarea
                    // value={description}
                    placeholder="Add Description"
                    // onChange={(e)=>setDescription(e.target.value)}
                    className="grow textFieldBG w-full mt-4 rounded-2xl px-4 py-2"
                    />
                </div>

                {/* Delete Button */}
                <button className="flex items-center justify-center h-12 w-36 font-extrabold rounded-2xl textLight primaryGradient hover:cursor-pointer">
                    Add Event
                </button>
            </div>
        </div>
    );
}