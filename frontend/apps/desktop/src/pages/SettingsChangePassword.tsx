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
            <h2 className="text-3xl font-extrabold mb-6 primaryColor1">Settings {">"} Change Password</h2>

            <div className="h-full w-full p-8 space-y-6 flex flex-col flex-1">
                {/*Old Password */}
                <div className="flex items-center primaryGradient rounded-4xl p-4">
                    <label className="w-3/10  pl-10 text-white font-bold">Old Password</label>
                    <input
                    type="text"
                    defaultValue="Old Password"
                    className="w-8/10 bg-white rounded-full px-4 py-2 outline-none formText pl-10"
                    />
                </div>

                {/* New Password */}
                 <div className="flex items-center primaryGradient rounded-4xl p-4">
                    <label className="w-3/10  pl-10 text-white font-bold">New Password</label>
                    <input
                    type="text"
                    defaultValue="New Password"
                    className="w-8/10 bg-white rounded-full px-4 py-2 outline-none formText pl-10"
                    />
                    <button type="button" className="absolute right-5 flex items-center mr-18">
                        <EyeOff size={20} />
                    </button>
                </div>

                {/* Confirm New Password */}
                <div className="flex items-center primaryGradient rounded-4xl p-4">
                    <label className="w-3/10  pl-10 text-white font-bold">Confirm New Password</label>
                    <input
                    type="text"
                    defaultValue="Confirm New Password"
                    className="w-8/10 bg-white rounded-full px-4 py-2 outline-none formText pl-10"
                    />
                    <button type="button" className="absolute right-5 flex items-center mr-18">
                        <EyeOff size={20} />
                    </button>
                </div>

                {/* Change Password */}
                <div className="flex justify-center rounded-4xl p-4 primaryColor1BG mt-auto">
                    <label className="pl-10 text-white font-bold">Change Password</label>
                </div>
            </div>
        </div>
    );
}