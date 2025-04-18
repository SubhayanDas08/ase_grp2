import { useNavigate } from "react-router-dom";

  export default function About(): JSX.Element {
    const navigate=useNavigate();

    return (
        <div className="h-full w-full flex flex-col">
            <div className="mainHeaderHeight w-full flex items-center justify-between">
                <div className="titleText primaryColor1 flex">
                    <div className="underline cursor-pointer mr-2" onClick={()=>navigate("/settings/")}>Settings</div>
                    <div className="mr-2">{">"}</div>
                    <div>About</div>
                </div>
            </div>
            <div className="italic">
            This application has been developed by Team 2 as part of the Advanced Software Engineering module. It focuses on building smart, sustainable and data-driven solutions to support sustainable urban living in Dublin.
            <div className="mt-5">
            Team Members:
            <ul className="list-disc ml-6 mt-2">
            <li>Abhigyan Khaund</li>
            <li>Adrieja Bhowmick</li>
            <li>Agathe Mignot</li>
            <li>Akshit Saini</li>
            <li>Boris Stavisky</li>
            <li>Kartik Tola</li>
            <li>Sibin George</li>
            <li>Simon Walter</li>
            <li>Subhayan Das</li>
            </ul>
            </div>
            </div>
        </div>
    );
}