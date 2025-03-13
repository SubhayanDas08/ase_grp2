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

  export default function SettingsProfile({ setUserAuthenticated }: SettingsProps): JSX.Element {
    const [firstName, setFirstName] = useState<string>("Enter your firstname");
    const [lastName, setLastName] = useState<string>("Enter your lastname");
    const [email, setEmail] = useState<string>("sample.email@gmail.com");
    const [phoneNumber, setphoneNumber] = useState<string>("+353 899739832");

    return (
        <div className="h-full w-full flex flex-col">
            <h2 className="text-3xl font-bold mb-6 primaryColor1">Settings {">"} Profile</h2>

            <div className="h-full w-full p-8 space-y-6 flex flex-col flex-1">
                {/* First Name */}
                <div className="flex items-center primaryGradient rounded-4xl p-4">
                    <label className="w-2/10  pl-10 text-white font-bold">Firstname</label>
                    <input
                    type="text"
                    defaultValue="Firstname"
                    className="w-8/10 bg-white rounded-full px-4 py-2 outline-none formText pl-10"
                    />
                </div>

                {/* Last Name */}
                <div className="flex items-center primaryGradient rounded-4xl p-4">
                    <label className="w-2/10  pl-10 text-white font-bold">Last Name</label>
                    <input
                    type="text"
                    defaultValue="Firstname"
                    className="w-8/10 bg-white rounded-full px-4 py-2 outline-none formText pl-10"
                    />
                </div>

                {/* Email */}
                <div className="flex items-center primaryGradient rounded-4xl p-4">
                    <label className="w-2/10  pl-10 text-white font-bold">Email</label>
                    <input
                    type="text"
                    defaultValue="Email"
                    className="w-8/10 bg-white rounded-full px-4 py-2 outline-none formText pl-10"
                    />
                </div>

                {/* Phone Number */}
                <div className="flex items-center primaryGradient rounded-4xl p-4">
                    <label className="w-2/10  pl-10 text-white font-bold">Phone Number</label>
                    <input
                    type="text"
                    defaultValue="Phone Number"
                    className="w-8/10 bg-white rounded-full px-4 py-2 outline-none formText pl-10"
                    />
                </div>

                {/* Delete Account */}
                <div className="flex justify-center rounded-4xl p-4 error mt-auto">
                    <label className="pl-10 text-white font-bold">Delete Account</label>
                </div>
            </div>
        </div>
    );
}