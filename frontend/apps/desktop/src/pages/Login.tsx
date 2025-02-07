import Logo from "../assets/Logo.svg";
import GoogleLogo from "../assets/GoogleLogo.svg";

export default function Login() {
    return (
        <div className="flex h-full w-full">
            <div className="flex justify-center h-full w-1/2">
                <div  className="flex flex-col justify-center h-full w-2/3">
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
                                <input placeholder="Email" className="flex items-center loginRegistrationFormInput"/>
                            </div>
                            <div className="flex justify-center items-center h-1/3">
                                <input placeholder="Password" className="flex items-center loginRegistrationFormInput"/>
                            </div>
                            <div className="flex justify-center items-center h-1/3 ">
                                <button className="loginRegistrationButton">
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
                            <span className="primaryColor1 ml-1">
                                Sign up
                            </span>
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

