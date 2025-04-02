import { FaBolt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authenticatedGet } from "../utils/auth";
import { useEffect, useState } from "react";
  
export default function FleetSize(): JSX.Element {
    const navigate=useNavigate();
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

    useEffect(() => {
        const getDaysAndYear = (monthName: string) => {
            const monthMap = {
                January: 0, February: 1, March: 2, April: 3,
                May: 4, June: 5, July: 6, August: 7,
                September: 8, October: 9, November: 10, December: 11,
            };
    
            const currentDate = new Date();
            const currentMonthIndex = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            const selectedMonthIndex = monthMap[monthName as keyof typeof monthMap];
    
            if (selectedMonthIndex !== undefined) {
                const selectedYear = selectedMonthIndex < currentMonthIndex
                    ? currentYear + 1
                    : currentYear;
                setYear(selectedYear.toString());
    
                const days = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
                const dayList = Array.from({ length: days }, (_, i) => i + 1);
                setDaysInMonth(dayList);
            } else {
                setDaysInMonth([]);
                setYear("");
            }
            };
    
        getDaysAndYear(month);
    }, [month]);
    

    return(
        <div className="w-full h-full flex flex-col">
            <div className="mainHeaderHeight w-full flex items-center justify-between">
                <div className="titleText primaryColor1">Fleet Size Recommendation</div>
                {/* <div className="flex h-fit w-fit items-center justify-end">
                    <div className="px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out primaryColor2BG text-white cursor-pointer"
                    onClick={()=>navigate("/home")}>
                        View Bus Fleet Congestion
                    </div>
                </div> */}
            </div>
            <div className="h-full w-full flex flex-col space-y-3">

                <div className="space-y-3">
                
                    <div className="flex justify-between">
                        {/* Month */}
                        <div className="min-w-[50%]">
                            <h3 className="text-2xl font-extrabold primaryColor1 mb-3">Month</h3>
                             <select
                    className="w-60 p-2 h-10 border-gray-100 appearance-none textFieldBG rounded-md bg-white text-black"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}>
                            <option value="">Select Month</option>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                        </div>

                        {/* Year */}
                        <div className="min-w-[50%]">
                        <h3 className="text-2xl font-extrabold primaryColor1 mb-3">Year</h3>
                        <input
                            placeholder="Select Year"
                            type="text"
                            className="w-60 p-2 h-10 border-gray-100 textFieldBG rounded-md bg-white text-black"
                            value={year}
                            readOnly
                        />
                        </div>
                    </div>
                </div>

                <div>
                    <button className="flex items-center justify-center mt-5 h-10 w-60 font-extrabold rounded-2xl textLight primaryGradient hover:cursor-pointer">View Recommendation</button>
                </div>


                {/* // Recommendation Card */}
                <div className="flex items-center h-25 mt-20 rounded-3xl primaryGradient hover:cursor-pointer">
                    <div className="h-14 w-14 ml-5 flex items-center justify-center rounded-full bg-white">
                        <FaBolt className="text-2l" />
                    </div>
                    <div className="ml-10 flex flex-col">
                        <div className="text-lg font-semibold textLight">Dublin</div>
                        <div className="textLight"><span className="textLight font-semibold">Current Fleet Size:</span> 120</div>
                        <div className="textLight"><span className="textLight font-semibold">Recommended Fleet Size for April:</span> 115</div>
                    </div>
                </div>

            </div>

        </div>
    );
}