import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 

interface SettingsProps {
    setUserAuthenticated: (userAuthenticated: any) => void;
  }
  
  interface Device {
    id: string;
    name: string;
    lastActive: string;
    status: string;
  }

  export default function SettingsProfile({ setUserAuthenticated }: SettingsProps): JSX.Element {
    const [firstName, setFirstName] = useState<string>("Enter your firstname");
    const [lastName, setLastName] = useState<string>("Enter your lastname");
    const [email, setEmail] = useState<string>("sample.email@gmail.com");
    const [phoneNumber, setphoneNumber] = useState<string>("+353 899739832");

    return (
        <div className="h-full w-full flex flex-col">
            <h2 className="text-5xl font-extrabold mb-10 primaryColor1">Settings {">"} Report An Issue</h2>

            <div className="h-full w-full space-y-6 flex flex-col">
                {/*Event Title */}
                <div className="">
                <h3 className="text-2xl font-extrabold primaryColor1">Subject</h3>
                <input
                    type="text"
                    defaultValue="Old Password"
                    className="textFieldBG w-full mt-4 rounded-2xl px-4 py-2 formText"
                    />
                </div>

                {/* Event Description */}
                <div className="flex flex-col h-50 ">
                <h3 className="text-2xl font-extrabold primaryColor1">Issue Description</h3>
                <textarea
                    defaultValue="Add Description"
                    className="grow textFieldBG w-full mt-4 rounded-2xl px-4 py-2 formText"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-center h-12 w-35 font-extrabold rounded-2xl textLight primaryGradient">
                    Report
                </div>
            </div>
        </div>
    );
}