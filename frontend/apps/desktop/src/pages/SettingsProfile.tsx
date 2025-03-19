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
    const [firstName, setFirstName] = useState<string>("John");
    const [lastName, setLastName] = useState<string>("Doe");
    const [email, setEmail] = useState<string>("user.email@gmail.com");
    const [phoneNumber, setphoneNumber] = useState<string>("+353 899739832");

    const handleSubmit=()=>{
        const userData={
            firstName,lastName
        };
        console.log("Submitted Data",userData);  
    }

    return (
        <div className="h-full w-full flex flex-col">
            <h2 className="text-5xl mb-10 font-bold mb-6 primaryColor1">Settings {">"} Profile</h2>

            <div className="h-full w-full space-y-6 flex flex-col flex-1">
                {/* First Name */}
                <div className="flex items-center primaryGradient rounded-4xl p-4">
                    <label className="w-2/10  pl-10 text-white font-bold">Firstname</label>
                    <input
                    type="text"
                    value={firstName}
                    placeholder="Enter your First Name"
                    onChange={(e)=>setFirstName(e.target.value)}
                    className="w-8/10 bg-white rounded-full px-4 py-2 outline-none formText pl-10"
                    />
                </div>

                {/* Last Name */}
                <div className="flex items-center primaryGradient rounded-4xl p-4">
                    <label className="w-2/10  pl-10 text-white font-bold">Last Name</label>
                    <input
                    type="text"
                    value={lastName}
                    placeholder="Enter your Last Name"
                    onChange={(e)=>setLastName(e.target.value)}
                    className="w-8/10 bg-white rounded-full px-4 py-2 outline-none formText pl-10"
                    />
                </div>

                {/* Email */}
                <div className="flex items-center primaryGradient rounded-4xl p-4">
                    <label className="w-2/10  pl-10 text-white font-bold">Email</label>
                    <input
                    type="text"
                    value={email}
                    className="w-8/10 textFieldBGDark rounded-full px-4 py-2 outline-none formText pl-10"
                    />
                </div>

                {/* Phone Number */}
                <div className="flex items-center primaryGradient rounded-4xl p-4">
                    <label className="w-2/10  pl-10 text-white font-bold">Phone Number</label>
                    <input
                    type="text"
                    value={phoneNumber}
                    className="w-8/10 textFieldBGDark rounded-full px-4 py-2 outline-none formText pl-10"
                    />
                </div>

                <button className="flex justify-center rounded-4xl p-4 text-white font-bold mt-auto bg-[#04b9c6]  hover:bg-[#029aa5] cursor-pointer"
                onClick={handleSubmit}>
                    Save
                </button>
            </div>
        </div>
    );
}