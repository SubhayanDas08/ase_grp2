import { FaBolt } from "react-icons/fa";

interface SettingsProps {
    setUserAuthenticated: (userAuthenticated: any) => void;
  }
  
export default function AddEvent({setUserAuthenticated}:SettingsProps): JSX.Element {
    return(
        <div className="w-full h-full">
            <div className="flex">
            <h2 className="text-5xl mb-10 font-extrabold primaryColor1">Events</h2>
            <div className="flex grow">
                <div className="flex justify-center items-center ml-auto mr-4 mt-4 mb-auto h-10 w-35 rounded-2xl primaryColor1BG font-semibold textLight">
                    + Add Event
                </div>
            </div>
            </div>
            <div className="h-full w-full flex flex-col space-y-3 bg-amber-500">
                {/* Adding an Event */}
                <input className="textFieldBG" placeholder="Event Name">
                </input>
            </div>
        </div>
    );
}