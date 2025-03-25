import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SettingsProps {
    setUserAuthenticated: (userAuthenticated: any) => void;
  }
  
  interface Device {
    id: string;
    name: string;
    lastActive: string;
    status: string;
  }

  export default function SettingsProfile({ setUserAuthenticated }: SettingsProps): JSX.Element {
    const [subject, setSubject] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate=useNavigate();

    const handleSubmit=(e: React.FormEvent)=>{
        e.preventDefault();

        if (!subject.trim() || !description.trim()) {
            setErrorMessage("Subject and Description cannot be empty.");
            return;
        }

        console.log("Issue succesfully reported!");
        alert("Issue succesfully reported!");

        setSubject("");
        setDescription("");
    }


    return (
        <div className="h-full w-full flex flex-col">
            <h2 className="text-5xl mb-10 font-bold mb-6 primaryColor1">
            <span className="cursor-pointer border-b-5 border-primaryColor1 pb-1" onClick={()=>navigate("/settings/")}>Settings</span><span> </span>
            {">"} Report an Issue
            </h2>
            <form onSubmit={handleSubmit}>
            <div className="h-full w-full space-y-6 flex flex-col">
                {/*Subject */}
                <div className="">
                <h3 className="text-2xl font-extrabold primaryColor1">Subject</h3>
                <input
                    type="text"
                    value={subject}
                    placeholder="Add Subject of the Issue"
                    onChange={(e)=>setSubject(e.target.value)}
                    className="textFieldBG w-full mt-4 rounded-2xl px-4 py-2 textDark"
                    />
                </div>

                {/* Event Description */}
                <div className="flex flex-col h-50 ">
                <h3 className="text-2xl font-extrabold primaryColor1">Issue Description</h3>
                <textarea
                    value={description}
                    placeholder="Add Description"
                    onChange={(e)=>setDescription(e.target.value)}
                    className="grow textFieldBG w-full mt-4 rounded-2xl px-4 py-2"
                    />
                </div>

                {/* Submit Button */}
                <button className="flex items-center justify-center h-12 w-35 font-extrabold rounded-2xl textLight primaryGradient hover:cursor-pointer"
                type="submit">
                    Report
                </button>
            </div>
            </form>
        </div>
    );
}