import { FaBolt } from "react-icons/fa";

interface SettingsProps {
    setUserAuthenticated: (userAuthenticated: any) => void;
  }
  
export default function Events({setUserAuthenticated}:SettingsProps): JSX.Element {
    return(
        <div className="w-full h-full">
            <h2 className="text-5xl mb-10 font-extrabold primaryColor1">Events</h2>
            <div className="h-full w-full flex flex-col">
                {/* Event Card */}
                <div className="ok flex items-center h-20 rounded-3xl primaryGradient">
                    <div className="h-14 w-14 ml-5 flex items-center justify-center rounded-full bg-white">
                        <FaBolt className="text-2l"/>
                    </div>
                    <div className="ml-10 flex flex-col">
                        <div className="text-lg font-semibold textLight">Lightning strike in Hamilton Gardens</div>
                        <div className="textLight">Burning houses, People crying</div>
                    </div>
                    <div className="flex flex-row-reverse">
                        11:11
                    </div>
                </div>
            </div>
        </div>
    );
}