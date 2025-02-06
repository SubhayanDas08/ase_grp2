import Logo from "../assets/Logo.svg";
import GoogleLogo from "../assets/GoogleLogo.svg";

export default function Login() {
    return (
        <div className="flex h-full w-full">
            <div className="flex justify-center h-full w-1/2">
                <div  className="flex flex-col justify-center h-full w-2/3">
                    <div className="h-2/3">
                        <div className="text-center h-1/5">
                            <div className="text-2xl font-bold" style={{color: "#029AA5"}}>
                                Login to your account
                            </div>
                            <div className= "text-xs" style={{color:"#70706F"}}>
                                Welcome back ! Please enter your details.
                            </div>
                        </div>
                        <div className="text-center h-1/2">
                            <div className="flex justify-center  items-center h-1/3">
                                <input placeholder="Email" className="flex items-center loginRegistrationForm ps-5" style={{color:"#70706F50"}}/>
                            </div>
                            <div className="flex justify-center  items-center h-1/3">
                                <input placeholder="Password" className="flex items-center loginRegistrationForm ps-5" style={{color:"#029AA5"}}/>
                            </div>
                            <div className="flex justify-center  items-center h-1/3 ">
                                <button className="loginRegistrationButton text-white">
                                    Log In
                                </button>
                            </div> 
                        </div>
                         <div className="text-center h-1/4">
                            <div className="h-1/3 flex justify-center items-center">
                                or
                            </div>
                            <div className="h-2/3 flex justify-center items-center">
                                <button className="loginGoogleRegistrationButton flex flex-row justify-center items-center">
                                    <div>
                                        <img src={GoogleLogo} alt="GoogleLogo" />
                                    </div>
                                    <span style={{marginLeft:"7px"}}>
                                        Log In with Google
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="text-center h-1/6">
                            <span style={{color:"#70706F"}}>
                                Don't have an account? 
                            </span>
                            <span style={{color:"#029AA5", marginLeft:"5px"}}>
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

