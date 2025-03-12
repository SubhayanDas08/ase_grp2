import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SettingsProps {
    setUserAuthenticated: (userAuthenticated: any) => void;
  }
  
  interface Device {
    id: string;
    name: string;
    lastActive: string;
    status: string;
  }

  export default function Settings({ setUserAuthenticated }: SettingsProps): JSX.Element {
    const [firstName, setFirstName] = useState<string>("Enter your firstname");
    const [lastName, setLastName] = useState<string>("Enter your lastname");
    const [email, setEmail] = useState<string>("sample.email@gmail.com");
    const [phoneNumber, setphoneNumber] = useState<string>("+353 899739832");

    return (
        <div className="h-full w-full flex flex-col">
            <h2 className="text-3xl font-bold mb-6 primaryColor1">Settings {">"} Profile</h2>

            <div className="h-full w-full bg-red-500 max-w-lg mx-auto p-8 space-y-6">
                {/* First Name */}
                <div className="flex items-center primaryColor1 rounded-full p-4">
                    <label className="w-1/4 text-white font-bold">Firstname</label>
                    <input
                    type="text"
                    defaultValue="Firstname"
                    className="w-3/4 bg-white rounded-full px-4 py-2 outline-none"
                    />
                </div>

                {/* Last Name */}
                <div className="flex h-full w-full items-center primaryColor1 rounded-full p-4">
                <label className="w-1/4 text-white font-bold">Lastname</label>
                    <input
                    type="text"
                    defaultValue="Lastname"
                    className="w-3/4 bg-white rounded-full px-4 py-2 outline-none"
                    />
                </div>
            </div>
        </div>
    );
}