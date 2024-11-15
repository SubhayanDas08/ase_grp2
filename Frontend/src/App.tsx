import { useState } from "react";
import Navbar from "./components/navbar";
import "./App.css";

export default function App() {
  const [navbarMenu, setNavbarMenu] = useState(false);

  const openNavbarMenu = () => {
    setNavbarMenu(!navbarMenu);
  }

  return (
    <div className="relative ms-5 me-5 h-screen bg-gray-300">
      <div className="relative h-12 w-full">
        <Navbar openNavbarMenu={openNavbarMenu}/>
      </div>
    </div>
  )
}
