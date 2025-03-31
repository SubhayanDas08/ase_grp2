import { useEffect, useState } from "react";

interface UserData {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
}
import { useNavigate } from "react-router-dom";
import { authenticatedGet } from "../utils/auth";

interface SettingsProps {
    setUserAuthenticated: (userAuthenticated: any) => void;
  }

  export default function SettingsProfile({ setUserAuthenticated }: SettingsProps): JSX.Element {
    const [firstName, setFirstName] = useState<string>("John");
    const [lastName, setLastName] = useState<string>("Doe");
    const [email, setEmail] = useState<string>("user.email@gmail.com");
    const [phoneNumber, setphoneNumber] = useState<string>("+353 899739832");

    const navigate=useNavigate();



    useEffect(()=>{
        const fetchUserDetails=async()=>{
            try {
                const response = await authenticatedGet<UserData>("/user/get");
                console.log("User response:", response);
                if (response) {
                    setFirstName(response.first_name || "N/A");
                    setLastName(response.last_name || "N/A");
                    setEmail(response.email || "N/A");
                    setphoneNumber(response.phone_number || "N/A");
                }
            } catch (error) {
                console.error("Failed to fetch user details!", error);
                
            }
        }
        fetchUserDetails();
    },[]);

    const handleSubmit=()=>{
        const userData={
            firstName,lastName
        };
        console.log("Submitted Data",userData);  
    }

    return (
        <div className="h-full w-full flex flex-col">
            <h2 className="text-5xl mb-10 font-bold mb-6 primaryColor1">
            <span className="cursor-pointer border-b-5 border-primaryColor1 pb-1" onClick={()=>navigate("/settings/")}>Settings</span> <span> </span>
            {">"} Profile
            </h2>

            <div className="h-full w-full space-y-6 flex flex-col flex-1">
                {/* First Name */}
                <div className="flex items-center primaryGradient rounded-4xl p-4">
                    <label className="w-2/10  pl-10 text-white font-bold">Firstname</label>
                    <input
                    type="text"
                    value={firstName}
                    placeholder="Enter your First Name"
                    onChange={(e)=>setFirstName(e.target.value)}
                    className="w-8/10 bg-white rounded-full px-4 py-2 outline-none textDark pl-10"
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
                    className="w-8/10 bg-white rounded-full px-4 py-2 outline-none textDark pl-10"
                    />
                </div>

                {/* Email */}
                <div className="flex items-center primaryGradient rounded-4xl p-4">
                    <label className="w-2/10  pl-10 text-white font-bold">Email</label>
                    <input
                    type="text"
                    value={email}
                    className="w-8/10 textFieldBGDark rounded-full px-4 py-2 outline-none pl-10 placeholder:text-black"
                    />
                </div>

                {/* Phone Number */}
                <div className="flex items-center primaryGradient rounded-4xl p-4">
                    <label className="w-2/10  pl-10 text-white font-bold">Phone Number</label>
                    <input
                    type="text"
                    value={phoneNumber}
                    className="w-8/10 textFieldBGDark rounded-full px-4 py-2 outline-none pl-10 placeholder:text-black"
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