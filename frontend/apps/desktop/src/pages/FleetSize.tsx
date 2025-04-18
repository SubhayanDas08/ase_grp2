import { FaBolt } from "react-icons/fa";
import { authenticatedPost } from "../utils/auth";
import { useEffect, useState } from "react";

interface Recommendation {
    "Bus City Services": string;
    "Recommended Buses": number;
}

export default function FleetSize(): JSX.Element {
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [dialogue, setDialogue] = useState<string>(""); 
    const [loading, setLoading] = useState(false); // New state for loader
    const currentFleetSizes: Record<string, number> = {
        "Dublin Bus": 501,
        "Cork city": 115,
        "Galway city": 52,
        "Limerick city": 33,
        "Waterford city": 10,
    };
    
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
            } else {
                setYear("");
            }
        };

        getDaysAndYear(month);
    }, [month]);

    const fetchRecommendations = async () => {
        if (!month) {
            alert("Please select a month to view recommendations.");
            return;
        }

        const monthMap = {
            January: 1, February: 2, March: 3, April: 4,
            May: 5, June: 6, July: 7, August: 8,
            September: 9, October: 10, November: 11, December: 12,
        };

        const selectedMonthIndex = monthMap[month as keyof typeof monthMap];

        setLoading(true); // Start loader

        try {
            const response = await authenticatedPost<{
                recommendations: Recommendation[];
                dialogue: string;
            }>(
                "/recommend/fleetsize",
                { month: selectedMonthIndex },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setRecommendations(response.recommendations);
            setDialogue(response.dialogue);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            alert("Failed to fetch recommendations. Please try again.");
        } finally {
            setLoading(false); // Stop loader regardless of outcome
        }
    };

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto">
            <div className="mainHeaderHeight w-full flex items-center justify-between">
                <div className="titleText primaryColor1">Fleet Size Recommendation</div>
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
                                onChange={(e) => setMonth(e.target.value)}
                            >
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
                    <button
                        className="flex items-center justify-center mt-5 h-10 w-60 font-extrabold rounded-2xl textLight primaryGradient cursor-pointer"
                        onClick={fetchRecommendations}
                        disabled={loading} // Disable the button while loading
                    >
                        {loading ? "Loading..." : "View Recommendation"}
                    </button>
                </div>

                {/* Loader Display */}
                {loading && (
                    <div className="flex items-center justify-center mt-5 text-gray-600">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            ></path>
                        </svg>
                        <span>Fetching recommendations...</span>
                    </div>
                )}

                {/* Dialogue */}
                {dialogue && !loading && (
                    <div className="mt-5 p-4 rounded-md formText italic">
                        <p className="text-lg text-gray-700">{dialogue}</p>
                    </div>
                )}

                {/* Recommendations */}
                <div className="mt-10 space-y-5">
                    {recommendations.map((rec, index) => (
                        <div
                            key={index}
                            className="flex items-center h-25 rounded-3xl primaryGradient"
                        >
                            <div className="h-14 w-14 ml-5 flex items-center justify-center rounded-full bg-white">
                                <FaBolt className="text-2l" />
                            </div>
                            <div className="ml-10 flex flex-col">
                                <div className="text-lg font-semibold textLight">
                                    {rec["Bus City Services"]}
                                </div>
                                <div className="textLight">
                                    <span className="textLight font-semibold">Current Fleet Size:</span>{" "}
                                    {currentFleetSizes[rec["Bus City Services"]] || "N/A"}
                                </div>
                                <div className="textLight">
                                    <span className="textLight font-semibold">Recommended Fleet Size:</span>{" "}
                                    {rec["Recommended Buses"]}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}