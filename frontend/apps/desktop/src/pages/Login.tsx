import Logo from "../assets/Logo.svg";

export default function Login() {
    return (
        <div className="flex h-full w-full">
            <div className="flex justify-center h-full w-1/2 bg-red-400">
                <div  className="flex flex-col justify-center h-full w-1/2 bg-red-300">
                    <div className="h-2/3 bg-green-300 ">
                        <div className="text-center bg-green-300 h-1/5">
                            <div className="text-2xl" style={{color: "#029AA5"}}>
                                Login to your account
                            </div>
                            <div>
                                Welcome back ! Please enter your details.
                            </div>
                        </div>
                        <div className="text-center bg-red-300 h-1/3">
                            <div className="h-1/2">
                                email
                            </div>
                            <div className="h-1/2">
                                password
                            </div>
                        </div>
                        <div className="text-center bg-red-200 h-1/3">
                            <div className="h-1/3">
                                Log In button
                            </div> 
                            <div className="h-1/3">
                                or
                            </div>
                            <div className="h-1/3">
                                Log in w Google
                            </div>
                        </div>
                        <div className="flex flex-row bg-red-100 h-1/6">
                            <div className="bg-green-300 w-2/3 text-center">
                                Don't have an account?
                            </div>
                            <div className="bg-green-400 w-1/3" style={{color: "#029AA5"}}>
                                Sign up
                            </div>
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

