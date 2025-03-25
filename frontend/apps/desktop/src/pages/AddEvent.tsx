import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoadScript,Autocomplete } from "@react-google-maps/api";
import "react-datepicker/dist/react-datepicker.css";
import "react-clock/dist/Clock.css";
import { time } from "console";

const GOOGLE_MAPS_API_KEY="AIzaSyBo-mXQolZZnHe2jxg1FDm8m-ViYP9_AaY"

interface SettingsProps {
    setUserAuthenticated: (userAuthenticated: any) => void;
  }
  
export default function AddEvent(): JSX.Element {

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>('10:00');
    const [selectedLocation, setSelectedLocation] = useState("");
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [neighbourhood, setNeighbourhood] = useState<string>("");

    const navigate=useNavigate();
    const handlePlaceSelect = () => {
        if (autocomplete) {
          const place = autocomplete.getPlace();

          if (place && place.formatted_address) {
            setSelectedLocation(place.formatted_address);
          }
        const addressComponents = place.address_components || [];
        const neighborhoodComponent = addressComponents.find((component) =>
        component.types.includes("sublocality") || component.types.includes("neighborhood")
        );

        if (neighborhoodComponent) {
            setNeighbourhood(neighborhoodComponent.long_name);
        } else {
            setNeighbourhood("");
        }
            }
      };
      
    return(
        <div className="w-full h-full">
            <div className="flex">
            <h2 className="text-5xl mb-10 font-extrabold primaryColor1">
            <span className="cursor-pointer border-b-5 border-primaryColor1 pb-0.6" onClick={()=>navigate("/events/")}>Events</span> {">"} Add Event</h2>
            </div>
            <div className="h-full w-full flex flex-col space-y-3">

            {/* Event Name */}
            <div className="">
                <h3 className="text-2xl font-extrabold primaryColor1">Event Name</h3>
                <input
                    type="text"
                    // value={subject}
                    placeholder="Add Name of the Event"
                    // onChange={(e)=>setSubject(e.target.value)}
                    className="textFieldBG border-gray-100 w-full mt-4 rounded-md px-4 py-2 textDark"
                    />
            </div>

                {/* Event Details */}
                <div className="space-y-3">

                    <div className="flex justify-between">
                        {/* Date of Event*/}
                        <div className="min-w-[50%]">
                            <h3 className="text-2xl font-extrabold primaryColor1">Date</h3>
                            <div className="relative w-full">
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date:Date | null) => setSelectedDate(date)}
                                dateFormat="dd/MM/yyyy"
                                className="p-2 w-60 border-gray-100 rounded-md textFieldBG"
                                placeholderText="Select Date of the Event"
                                popperPlacement="bottom-start"
                                popperClassName="z-50"
                                />
                            </div>
                        </div>

                        {/* Time of Event */}
                        <div className="min-w-[50%]">
                            <h3 className="text-2xl font-extrabold primaryColor1">Time</h3>
                            <div className="">
                            <input
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="p-2 w-60 border-gray-100 textFieldBG border-gray-300 rounded-md bg-white text-black"
                            />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        {/* Location of Event */}
                        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
                        <div className="min-w-[50%]">
                            <h3 className="text-2xl font-extrabold primaryColor1">Location</h3>
                            <div className="">
                            <Autocomplete
                                onLoad={(auto) => {
                                    setAutocomplete(auto);
                                    auto.setBounds(
                                      new google.maps.LatLngBounds(
                                        new google.maps.LatLng(53.2000, -6.4000),
                                        new google.maps.LatLng(53.4500, -6.0000)
                                      )
                                    );
                                    auto.setComponentRestrictions({ country: "IE" });
                                  }}
                                onPlaceChanged={handlePlaceSelect}>
                                <input
                                type="text"
                                placeholder="Search Location"
                                className="w-60 p-2 border-gray-100 textFieldBG border-gray-300 rounded-md bg-white text-black"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                />
                            </Autocomplete>
                            </div>
                        </div>
                        </LoadScript>

                        {/* City of Event */}
                        <div className="min-w-[50%]">
                            <h3 className="text-2xl font-extrabold primaryColor1">Area</h3>
                            <input
                            type="text"
                            placeholder="Area"
                            className="w-60 p-2 border-gray-100 textFieldBG border-gray-300 rounded-md bg-white text-black"
                            value={neighbourhood}
                            readOnly
                            />
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
                    className="grow textFieldBG w-full mt-4 rounded-md px-4 py-2"
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