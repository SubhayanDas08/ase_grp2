import Logo from "../assets/Logo.svg";
import GoogleLogo from "../assets/GoogleLogo.svg";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreateAccount() {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="flex h-full w-full">
            <div className="flex justify-center h-full w-1/2">
                <div  className="flex flex-col justify-center h-full w-2/3">
                    <div className="h-3/4">
                        <div className="text-center h-1/5">
                            <div className="titleText primaryColor1">
                                Create an Account
                            </div>
                            <div className= "miniText secondaryColor">
                                Welcome! Please login or sign up to our page
                            </div>
                        </div>
                        <div className="text-center h-1/2"> 
                            <div className="flex justify-center items-center h-1/5">
                                <div className="flex justify-center gap-2"> 
                                    <input placeholder="First Name" className="nameFormInput" />
                                    <input placeholder="Last Name" className="nameFormInput" />
                                </div>
                            </div>
                            <div className="flex justify-center items-center h-1/5">
                                <input placeholder="Email" className="flex items-center loginRegistrationFormInput"/>
                            </div>
                            <div className="flex justify-center items-center h-1/5">
                                <input placeholder="Phone Number" className="flex items-center loginRegistrationFormInput"/>
                            </div>
                            <div className="flex justify-center items-center h-1/5">
                                <input type={showPassword ? "text" : "password"} placeholder="Password" className="loginRegistrationFormInput ms-6"/>
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="-translate-x-10">
                                    {showPassword ? (<EyeOff className="w-6 h-6 secondaryColor" /> ) : (<Eye className="w-6 h-6 secondaryColor" />)}
                                </button>
                            </div>
                            <div className="flex justify-center items-center h-1/5">
                                <button className="loginRegistrationButton">
                                    Sign up
                                </button>
                            </div> 
                        </div>
                        <div className="text-center h-1/4">
                            <div className="h-2/5 flex justify-center items-center secondaryColor">
                                Or
                            </div>
                            <div className="h-3/5 flex justify-center items-center">
                                <button className="loginGoogleRegistrationButton flex flex-row justify-center items-center">
                                    <div>
                                        <img src={GoogleLogo} alt="GoogleLogo" />
                                    </div>
                                    <span className="ml-2">
                                        Log In with Google
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="text-center h-1/6 miniText">
                            <span className="secondaryColor">
                                Already have an account? 
                            </span>
                            <Link to="/" className="primaryColor1 ml-1 hover:underline">
                                Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col h-full w-1/2">
                <div className="flex justify-end h-2/3 w-full">
                    <img src={Logo} alt="Logo" />
                </div>
            </div>
        </div>
    )
}

