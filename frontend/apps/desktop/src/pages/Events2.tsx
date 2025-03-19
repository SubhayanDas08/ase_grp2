import { FaBolt } from "react-icons/fa";

interface SettingsProps {
    setUserAuthenticated: (userAuthenticated: any) => void;
  }
  
export default function Events2({setUserAuthenticated}:SettingsProps): JSX.Element {
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
            <div className="h-full w-full flex flex-col space-y-3">
                {/* Event Card */}
                <div className="flex items-center h-20 rounded-3xl primaryGradient">
                    <div className="h-14 w-14 ml-5 flex items-center justify-center rounded-full bg-white">
                        <FaBolt className="text-2l"/>
                    </div>
                    <div className="ml-10 flex flex-col">
                        <div className="text-lg font-semibold textLight">Lightning strike in Hamilton Gardens</div>
                        <div className="textLight">Burning houses, People crying</div>
                    </div>
                    <div className="flex justify-end grow mr-10 font-bold textLight">
                        11:11
                    </div>
                    
                </div>

                <div className="flex items-center h-20 rounded-3xl primaryGradient">
                    <div className="h-14 w-14 ml-5 flex items-center justify-center rounded-full bg-white">
                        <FaBolt className="text-2l"/>
                    </div>
                    <div className="ml-10 flex flex-col">
                        <div className="text-lg font-semibold textLight">Lightning strike in Hamilton Gardens</div>
                        <div className="textLight">Burning houses, People crying</div>
                    </div>
                    <div className="flex justify-end grow mr-10 font-bold textLight">
                        11:11
                    </div>
                    
                </div>

                <div className="flex items-center h-20 rounded-3xl primaryGradient">
                    <div className="h-14 w-14 ml-5 flex items-center justify-center rounded-full bg-white">
                        <FaBolt className="text-2l"/>
                    </div>
                    <div className="ml-10 flex flex-col">
                        <div className="text-lg font-semibold textLight">Lightning strike in Hamilton Gardens</div>
                        <div className="textLight">Burning houses, People crying</div>
                    </div>
                    <div className="flex justify-end grow mr-10 font-bold textLight">
                        11:11
                    </div>
                    
                </div>
            </div>

            <div className="flex w-full border border-gray-400 p-2">
                <div className="w-16 h-16 bg-red-500"></div>
                <div className="w-16 h-16 bg-green-500"></div>
                <div className="flex-grow bg-blue-500 p-2">
                    <div className="w-8 h-8 bg-yellow-500"></div>
                    <div className="w-8 h-8 bg-purple-500"></div>
                </div>
            </div>

            
        </div>
    );
}