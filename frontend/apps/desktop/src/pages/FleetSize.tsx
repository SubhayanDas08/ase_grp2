import { FaBolt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authenticatedGet } from "../utils/auth";
import { useEffect, useState } from "react";

interface Event {
    id: number;
    name: string;
    event_date: string;
    event_time: string;
    location: string;
    area: string;
    description: string;
  }
  
export default function FleetSize(): JSX.Element {
    const navigate=useNavigate();

    return(
        <div className="w-full h-full flex flex-col">
            <div className="mainHeaderHeight w-full flex items-center justify-between">
                <div className="titleText primaryColor1">Fleet Size Recommendation</div>
                <div className="flex h-fit w-fit items-center justify-end">
                    <div className="px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out primaryColor2BG text-white cursor-pointer"
                    onClick={()=>navigate("/home")}>
                        View Bus Fleet Congestion
                    </div>
                </div>
            </div>
            <div className="h-full w-full flex flex-col space-y-3">
                {/* // Event Card */}
                <div className="flex items-center h-20 rounded-3xl primaryGradient hover:cursor-pointer">
                    <div className="h-14 w-14 ml-5 flex items-center justify-center rounded-full bg-white">
                        <FaBolt className="text-2l" />
                    </div>
                    <div className="ml-10 flex flex-col">
                        <div className="text-lg font-semibold textLight">Recommendation 1</div>
                        <div className="textLight">Add more buses</div>
                    </div>
                    <div className="flex justify-end grow mr-10 font-bold textLight">
                        10:10
                    </div>
                </div>

            </div>

        </div>
    );
}