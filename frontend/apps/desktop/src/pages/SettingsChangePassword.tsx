import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 
import { authenticatedPost } from "../utils/auth";

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

    const [showPasswordOld,setShowPasswordOld] = useState<boolean>(false);
    const [showPasswordNew,setShowPasswordNew] = useState<boolean>(false);
    const [showPasswordConfirm,setShowPasswordConfirm] = useState<boolean>(false);
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate=useNavigate();

    useEffect(() => {
        if (errorMessage) {
            console.warn("Validation Error:", errorMessage);
        }
    }, [errorMessage]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        //Validation for New Password
        if(newPassword!==confirmNewPassword){
            setErrorMessage("New Password doesn't match");
            console.log(errorMessage);
            return;
        }
        
        if(newPassword.length<8){
            setErrorMessage("New Password must be at least 7 characters long!");
            console.log(errorMessage);
            return;
        }

        const response = await authenticatedPost<{
            message: string;
            token: string;
            refreshToken: string;
          }>("/user/changePassword", {
            oldPassword,
            newPassword,
          });
      
          localStorage.setItem("token", response.token);
          localStorage.setItem("refreshToken", response.refreshToken);
      
          alert("Password successfully updated!");
      
          setOldPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
          setErrorMessage("");
      
          setUserAuthenticated(false);
            }
        return (
            <div className="h-full w-full flex flex-col">
                <h2 className="text-5xl mb-10 font-bold mb-6 primaryColor1">
                <span className="cursor-pointer border-b-5 border-primaryColor1 pb-1" onClick={()=>navigate("/settings/")}>Settings</span><span> </span>
                {">"} Change Password
                </h2>
    
                <form onSubmit={handleSubmit} className="grow">
                <div className="h-full w-fullspace-y-6 flex flex-col flex-1 space-y-5">
                    {/*Old Password */}
                    <div className="flex items-center primaryGradient rounded-4xl p-4">
                        <label className="w-3/10  pl-10 text-white font-bold">Old Password</label>
                        <input
                        type={showPasswordOld ? "text":"password"}
                        value={oldPassword}
                        placeholder="Enter Old Password"
                        onChange={(e)=>setOldPassword(e.target.value)}
                        className="w-8/10 bg-white rounded-full px-4 py-2 outline-none formText pl-10"
                        />
                        <button type="button" className="absolute right-1 flex items-center mr-15"
                        onClick={()=>setShowPasswordOld(!showPasswordOld)}>
                            {!showPasswordOld ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
    
                    {/* New Password */}
                     <div className="flex items-center primaryGradient rounded-4xl p-4">
                        <label className="w-3/10  pl-10 text-white font-bold">New Password</label>
                        <input
                        type={showPasswordNew ? "text":"password"}
                        value={newPassword}
                        placeholder="Enter New Password"
                        onChange={(e)=>setNewPassword(e.target.value)}
                        className="w-8/10 bg-white rounded-full px-4 py-2 outline-none formText pl-10"
                        />
                        <button type="button" className="absolute right-1 flex items-center mr-15"
                        onClick={()=>setShowPasswordNew(!showPasswordNew)}>
                            {!showPasswordNew ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
    
                    {/* Confirm New Password */}
                    <div className="flex items-center primaryGradient rounded-4xl p-4">
                        <label className="w-3/10  pl-10 text-white font-bold">Confirm New Password</label>
                        <input
                        type={showPasswordConfirm ? "text":"password"}
                        value={confirmNewPassword}
                        placeholder="Enter the New Password Again"
                        onChange={(e)=>setConfirmNewPassword(e.target.value)}
                        className="w-8/10 bg-white rounded-full px-4 py-2 outline-none formText pl-10"
                        />
                        <button type="button" className="absolute right-1 flex items-center mr-15"
                        onClick={()=>setShowPasswordConfirm(!showPasswordConfirm)}>
                            {!showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
    
                    {/* Change Password */}
                    <button type="submit" className="flex justify-center rounded-4xl p-4 primaryColor1BG mt-auto hover:cursor-pointer text-white font-bold">
                        Change Password
                    </button>
                </div>
                </form>
            </div>
        );
    }