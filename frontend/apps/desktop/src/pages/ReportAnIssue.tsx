import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticatedPost } from "../utils/auth"; // Import authenticatedPost

interface SettingsProps {
  setUserAuthenticated: (userAuthenticated: any) => void;
}

interface Device {
  id: string;
  name: string;
  lastActive: string;
  status: string;
}

export default function SettingsProfile({
  setUserAuthenticated,
}: SettingsProps): JSX.Element {
  const [subject, setSubject] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !description.trim()) {
      setErrorMessage("Subject and Description cannot be empty.");
      return;
    }

    try {
      // Make the API call to report the issue
      const response = await authenticatedPost("/user/reportIssue", {
        subject: subject,
        description: description,
      });

      console.log("Issue successfully reported!", response);
      alert("Issue successfully reported!");

      setSubject("");
      setDescription("");
      setErrorMessage(""); // Clear any previous error messages
    } catch (error: any) {
      console.error(
        "Failed to report issue:",
        error.response?.data?.error || error.message,
      );
      setErrorMessage(
        error.response?.data?.error ||
          "Failed to report issue. Please try again.",
      );
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="mainHeaderHeight w-full flex items-center justify-between">
        <div className="titleText primaryColor1 flex">
          <div
            className="underline cursor-pointer mr-2"
            onClick={() => navigate("/settings/")}
          >
            Settings
          </div>
          <div className="mr-2">{">"}</div>
          <div>Report an Issue</div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col flex-1 h-full w-full space-y-6">
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          {/*Subject */}
          <div className="">
            <h3 className="text-2xl font-extrabold primaryColor1">Subject</h3>
            <input
              type="text"
              value={subject}
              placeholder="Add Subject of the Issue"
              onChange={(e) => setSubject(e.target.value)}
              className="textFieldBG w-full mt-4 rounded-2xl px-4 py-2 textDark"
            />
          </div>

          {/* Event Description */}
          <div className="flex flex-col h-50 ">
            <h3 className="text-2xl font-extrabold primaryColor1">
              Issue Description
            </h3>
            <textarea
              value={description}
              placeholder="Add Description"
              onChange={(e) => setDescription(e.target.value)}
              className="grow textFieldBG w-full mt-4 rounded-2xl px-4 py-2"
            />
          </div>

          {/* Submit Button */}
          <button
            className="flex items-center justify-center h-12 w-35 font-extrabold rounded-2xl textLight primaryGradient hover:cursor-pointer"
            type="submit"
          >
            Report
          </button>
        </div>
      </form>
    </div>
  );
}
