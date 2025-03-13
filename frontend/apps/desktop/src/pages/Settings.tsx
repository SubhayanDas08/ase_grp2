import { useState } from "react";
import { FaUser,FaSlidersH, FaFileAlt, FaInfoCircle } from "react-icons/fa";

interface SettingsProps {
    setUserAuthenticated: (userAuthenticated: any) => void;
  }

export default function Settings({setUserAuthenticated}:SettingsProps): JSX.Element {
    return(
        <div className="h-full w-full flex flex-col">
            <h2 className="text-5xl mb-10 font-bold primaryColor1">Settings</h2>

            <div className="h-full w-full flex flex-col space-y-5">
                {/* User Profile */}
                <div className="flex items-center primaryGradient rounded-3xl h-20">
                    <div className="w-14 h-14 ml-5 flex items-center justify-center rounded-full bg-white text-primaryColor2">
                        <FaUser className="text-2xl" />
                    </div>

                    <span className="ml-15 textLight text-xl font-semibold">Profile</span>
                </div>

                {/* Change Password */}
                <div className="flex items-center primaryGradient rounded-3xl h-20">
                <div className="w-14 h-14 ml-5 flex items-center justify-center rounded-full bg-white text-primaryColor2">
                        <FaSlidersH className="text-2xl" />
                    </div>

                    <span className="ml-15 textLight text-xl font-semibold">Change Password</span>
                </div>

                {/* Report an Issue */}
                <div className="flex items-center primaryGradient rounded-3xl h-20">
                <div className="w-14 h-14 ml-5 flex items-center justify-center rounded-full bg-white text-primaryColor2">
                        <FaFileAlt className="text-2xl" />
                    </div>

                    <span className="ml-15 textLight text-xl font-semibold">Report an Issue</span>
                </div>

                {/* About */}
                <div className="flex items-center primaryGradient rounded-3xl h-20">
                <div className="w-14 h-14 ml-5 flex items-center justify-center rounded-full bg-white text-primaryColor2">
                        <FaInfoCircle className="text-2xl" />
                    </div>

                    <span className="ml-15 textLight text-xl font-semibold">About</span>
                </div>
                
            </div>
        </div>
    );
}