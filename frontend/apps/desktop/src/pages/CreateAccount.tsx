import Logo from "../assets/Logo.svg";
import GoogleLogo from "../assets/GoogleLogo.svg";
import FullLogo from "../assets/FullLogo.svg";
import { useState, ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

interface FormDataInterface {
    firstName: string,
    lastName: string,
    email: string,
    phoneNb: string,
    password: string
}

export default function CreateAccount() {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState<FormDataInterface>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNb: "",
        password: "",
    });

    const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    };

    return (
        <div className="flex h-full w-full">
            <div className="flex flex-col justify-center h-full lg:w-1/2 w-full">
                <div  className="flex flex-col justify-center h-full w-full">
                    <div className="flex justify-end h-16 w-full">
                        <img src={FullLogo} alt="FullLogo" className="lg:h-0 lg:w-0 h-full w-full" />
                    </div>
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
                                <div className="flex justify-between gap-4" style={{width: "70%"}}> 
                                    <input type="text" name="firstName" placeholder="First Name" className="nameFormInput" onChange={handleFormData}/>
                                    <input type="text" name="lastName" placeholder="Last Name" className="nameFormInput" value={formData.lastName} onChange={handleFormData}/>
                                </div>
                            </div>
                            <div className="flex justify-center items-center h-1/5">
                                <input type="text" name="email" placeholder="Email" className="flex items-center loginRegistrationFormInput" value={formData.email} onChange={handleFormData}/>
                            </div>
                            <div className="flex justify-center items-center h-1/5">
                                <input type="text" name="phoneNb" placeholder="Phone Number" className="flex items-center loginRegistrationFormInput " value={formData.phoneNb} onChange={handleFormData}/>
                            </div>
                            <div className="flex justify-center items-center h-1/5">
                                <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" className="loginRegistrationFormInput ms-6" value={formData.password} onChange={handleFormData}/>
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="-translate-x-10">
                                    {showPassword ? (<EyeOff className="w-6 h-6 secondaryColor" /> ) : (<Eye className="w-6 h-6 secondaryColor" />)}
                                </button>
                            </div>
                            <div className="flex justify-center items-center h-1/5">
                                <button className="loginRegistrationButton" onClick={() => console.log(formData)}>
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
            <div className="flex flex-col h-full lg:w-1/2 w-0">
                <div className="flex justify-end w-full">
                    <img src={Logo} alt="Logo" />
                </div>
            </div>
        </div>
    )
}

