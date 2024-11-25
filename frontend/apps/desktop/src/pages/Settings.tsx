import { useState } from "react";

interface Device {
  id: string;
  name: string;
  lastActive: string;
  status: string;
}

export default function Settings(): JSX.Element {
  const [email, setEmail] = useState<string>("sample.email@gmail.com");
  const [firstName, setFirstName] = useState<string>("Enter your firstname");
  const [lastName, setLastName] = useState<string>("Enter your lastname");
  const [currentPassword, setCurrentPassword] = useState<string>("Enter your password");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string>(
    "https://via.placeholder.com/80"
  ); // Default placeholder image

  const devices: Device[] = [
    {
      id: "001",
      name: "My Laptop",
      lastActive: "25-11-2024 10:00 AM",
      status: "Active",
    },
  ];

  const [isUpdatesEnabled, setIsUpdatesEnabled] =
    useState<boolean>(true);

  const toggleSocialMedia = (): void => {
    setIsUpdatesEnabled(!isUpdatesEnabled);
  };

  const togglePasswordVisibility = (): void => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setProfilePicture(reader.result as string); // Update the profile picture
          setIsModalOpen(false); // Close the modal after upload
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="contentContainer p-8 overflow-y-auto textColourDark">
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center">
          <img
            src={profilePicture}
            alt="Profile"
            className="rounded-full w-20 h-20 mr-4 object-cover"
          />
          <div>
            <button
              className="text-sm text-blue-500 underline"
              onClick={() => setIsModalOpen(true)}
            >
              Upload new picture
            </button>
          </div>
        </div>

        {/* Modal for Upload */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Upload Photo</h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 mr-4"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block">First Name</label>
            <input
              type="text"
              placeholder={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-md shadow-sm secondaryBGColour textColourLight ps-1 pe-1"
            />
          </div>
          <div>
            <label className="block">Last Name</label>
            <input
              type="text"
              placeholder={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-md shadow-sm secondaryBGColour textColourLight ps-1 pe-1"
            />
          </div>
        </div>

        {/* Contact Email */}
        <div>
          <label className="block">Contact Email</label>
          <input
            type="email"
            placeholder={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm secondaryBGColour textColourLight ps-1 pe-1"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block">Password</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="password"
              placeholder={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm secondaryBGColour textColourLight ps-1 pe-1"
            />
          </div>
          <br />
          <button className="px-4 py-2 bg-blue-600 textColourLight rounded hover:bg-blue-700">
            Change Password
          </button>
        </div>

        {/* Notification Preferences */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 tertiaryColour">Notification Preferences</h2>
          <div className="flex items-center justify-between">
            <span className="text-xl textColourLight">Updates</span>
            <button
              className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                isUpdatesEnabled ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={toggleSocialMedia}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    isUpdatesEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Client Device Information */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Client Device Information</h2>
          <table className="w-full table-auto">
            <thead>
              <tr className="secondaryBGColour border-b">
                <th className="text-left py-2 px-4">Device ID</th>
                <th className="text-left py-2 px-4">Device Name</th>
                <th className="text-left py-2 px-4">Last Active</th>
                <th className="text-left py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id} className="border-b">
                  <td className="py-2 px-4">{device.id}</td>
                  <td className="py-2 px-4">{device.name}</td>
                  <td className="py-2 px-4">{device.lastActive}</td>
                  <td className="py-2 px-4">{device.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-4 mt-4">
          <button className="w-40 px-4 py-2 bg-blue-600 textColourLight rounded hover:bg-blue-700">
            Save Changes
          </button>
          <div className="flex space-x-4 mt-4">
            <button className="w-40 px-4 py-2 bg-red-600 textColourLight rounded hover:bg-red-700">
              Logout
            </button>
            <button className="w-40 px-4 py-2 bg-red-600 textColourLight rounded hover:bg-red-700">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}