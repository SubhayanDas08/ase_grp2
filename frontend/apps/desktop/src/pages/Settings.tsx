import { FaUser,FaSlidersH, FaFileAlt, FaInfoCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

interface SettingsProps {
    setUserAuthenticated: (userAuthenticated: any) => void;
    onLogout: () => void;
  }

export default function Settings({setUserAuthenticated, onLogout}:SettingsProps): JSX.Element {
    const navigate=useNavigate();

    return(
        <div className="h-full w-full flex flex-col">
            <div className="mainHeaderHeight w-full flex items-center justify-between">
                <div className="titleText primaryColor1">Settings</div>
            </div>
            <div className="h-full w-full">
                <div className="h-full w-full flex flex-col space-y-5">
                    {/* User Profile */}
                    <div className="flex items-center  rounded-3xl h-20 primaryGradient hover:cursor-pointer"
                        onClick={()=>navigate("/settings/profile")}>
                        <div className="w-14 h-14 ml-5 flex items-center justify-center rounded-full bg-white text-primaryColor2">
                            <FaUser className="text-2xl" />
                        </div>
                        <span className="ml-15 textLight text-xl font-semibold">Profile</span>
                    </div>

                    {/* Change Password */}
                    <div className="flex items-center primaryGradient rounded-3xl h-20 hover:cursor-pointer"
                        onClick={()=>navigate("/settings/changepassword")}>
                    <div className="w-14 h-14 ml-5 flex items-center justify-center rounded-full bg-white text-primaryColor2">
                            <FaSlidersH className="text-2xl" />
                        </div>

                        <span className="ml-15 textLight text-xl font-semibold">Change Password</span>
                    </div>

                    {/* Report an Issue */}
                    <div className="flex items-center primaryGradient rounded-3xl h-20 hover:cursor-pointer"
                        onClick={()=>navigate("/settings/report")}>
                    <div className="w-14 h-14 ml-5 flex items-center justify-center rounded-full bg-white text-primaryColor2">
                            <FaFileAlt className="text-2xl" />
                        </div>

                        <span className="ml-15 textLight text-xl font-semibold">Report an Issue</span>
                    </div>

                    {/* About */}
                    <div className="flex items-center primaryGradient rounded-3xl h-20 hover:cursor-pointer"
                    onClick={()=>navigate("/settings/about")}>
                    <div className="w-14 h-14 ml-5 flex items-center justify-center rounded-full bg-white text-primaryColor2">
                            <FaInfoCircle className="text-2xl" />
                        </div>

                        <span className="ml-15 textLight text-xl font-semibold">About</span>
                    </div>

                    {/* Log Out */}
                    <div className="flex items-center primaryGradient rounded-3xl h-20 hover:cursor-pointer"
                    onClick={()=>{
                        logout();
                        setUserAuthenticated(false);
                        onLogout();
                        navigate("/login");
                        }
                    }>
                    <div className="w-14 h-14 ml-5 flex items-center justify-center rounded-full bg-white text-primaryColor2">
                            <FiLogOut className="text-2xl" />
                        </div>

                        <span className="ml-15 textLight text-xl font-semibold">Log Out</span>
                    </div>
                </div>
            </div>
        </div>
    );
}