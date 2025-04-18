import Logo from "../assets/Logo.svg";
import FullLogo from "../assets/FullLogo.svg";
import { useState, ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { register } from "../utils/auth";

interface RegisterProps {
  setUserAuthenticated: (userAuthenticated: boolean) => void;
}

interface FormDataInterface {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
}

export default function CreateAccount({ setUserAuthenticated }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormDataInterface>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
  });

  const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegistration = async () => {
    if (
      !formData.email ||
      !formData.password ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.phone_number
    ) {
      alert("All fields are required. Please fill in all information.");
      return;
    }

    try {
      const result = await register(formData);

      if (!result.success) {
        alert(result.message);
        return;
      } else {
        console.log("Registration Success");
        // Set authentication state
        setUserAuthenticated(true);
        navigate("/home");
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      alert("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="flex h-full w-full overflow-y-auto">
      <div
        className="flex flex-col justify-center h-full lg:w-1/2 w-full"
        style={{ minHeight: "800px" }}
      >
        <div className="flex justify-end h-16 w-full">
          <img
            src={FullLogo}
            alt="FullLogo"
            className="lg:h-0 lg:w-0 h-full w-full"
          />
        </div>
        <div className="h-3/4">
          <div className="text-center h-1/5">
            <div className="titleText primaryColor1">Create an Account</div>
            <div className="miniText secondaryColor">
              Welcome! Please login or sign up to our page
            </div>
          </div>
          <div className="text-center h-1/2">
            <div className="flex justify-center items-center h-1/5">
              <div
                className="flex justify-between gap-4"
                style={{ width: "70%" }}
              >
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  className="nameFormInput"
                  onChange={handleFormData}
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  className="nameFormInput"
                  value={formData.last_name}
                  onChange={handleFormData}
                />
              </div>
            </div>
            <div className="flex justify-center items-center h-1/5">
              <input
                type="text"
                name="email"
                placeholder="Email"
                className="flex items-center loginRegistrationFormInput"
                value={formData.email}
                onChange={handleFormData}
              />
            </div>
            <div className="flex justify-center items-center h-1/5">
              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                className="flex items-center loginRegistrationFormInput "
                value={formData.phone_number}
                onChange={handleFormData}
              />
            </div>
            <div className="flex justify-center items-center h-1/5">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="loginRegistrationFormInput ms-6"
                value={formData.password}
                onChange={handleFormData}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="-translate-x-10"
              >
                {showPassword ? (
                  <EyeOff className="w-6 h-6 secondaryColor" />
                ) : (
                  <Eye className="w-6 h-6 secondaryColor" />
                )}
              </button>
            </div>
            <div className="flex justify-center items-center h-1/5">
              <button
                className="loginRegistrationButton"
                onClick={() => handleRegistration()}
              >
                Sign up
              </button>
            </div>
          </div>
          <div className="text-center h-1/6 miniText">
            <span className="secondaryColor">Already have an account?</span>
            <Link to="/" className="primaryColor1 ml-1 hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-full lg:w-1/2 w-0">
        <div className="flex justify-end w-full">
          <img src={Logo} alt="Logo" />
        </div>
      </div>
    </div>
  );
}
