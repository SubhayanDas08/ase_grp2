import Logo from "../assets/Logo.svg";
import FullLogo from "../assets/FullLogo.svg";
import GoogleLogo from "../assets/GoogleLogo.svg";
import { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

interface LoginProps {
    setUserAuthenticated: (userAuthenticated: any) => void;
}

interface FormDataInterface {
    email: string,
    password: string
}

export default function Login({ setUserAuthenticated }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<FormDataInterface>({
        email: "",
        password: "",
    });

    const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    };

    const checkRequiredFormFields = () => {
        for (const [key, value] of Object.entries(formData)) {
            if(value === "") console.log(key + " is empty")
            else console.log(`${key}: ${value}`);
        }
        setUserAuthenticated(true);
    }

    return (
        <div className="flex h-full w-full overflow-y-auto">
            <div className="flex flex-col justify-center h-full lg:w-1/2 w-full" style={{minHeight: "800px"}}>
                <div className="flex justify-end h-16 w-full">
                    <img src={FullLogo} alt="FullLogo" className="lg:h-0 lg:w-0 h-full w-full" />
                </div>
                <div className="h-2/3">
                    <div className="text-center h-1/5">
                        <div className="titleText primaryColor1">
                            Log In to your account
                        </div>
                        <div className= "miniText secondaryColor">
                            Welcome back! Please enter your details.
                        </div>
                    </div>
                    <div className="text-center h-1/2">
                        <div className="flex justify-center items-center h-1/3">
                            <input type="text" name="email" placeholder="Email" className="flex items-center loginRegistrationFormInput" value={formData.email} onChange={handleFormData}/>
                        </div>
                        <div className="flex justify-center items-center h-1/3">
                            <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" className="loginRegistrationFormInput ms-6" value={formData.password} onChange={handleFormData}/>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="-translate-x-10">
                                {showPassword ? (<EyeOff className="w-6 h-6 secondaryColor" /> ) : (<Eye className="w-6 h-6 secondaryColor" />)}
                            </button>
                        </div>
                        <div className="flex justify-center items-center h-1/3 ">
                            <button className="loginRegistrationButton"  onClick={() => checkRequiredFormFields()}>
                                Log In
                            </button>
                        </div> 
                    </div>
                        <div className="text-center h-1/4">
                        <div className="h-1/3 flex justify-center items-center secondaryColor">
                            Or
                        </div>
                        <div className="h-2/3 flex justify-center items-center">
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
                            Don't have an account? 
                        </span>
                        <Link to="/create_account" className="primaryColor1 ml-1 hover:underline">
                            Sign up
                        </Link>
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

