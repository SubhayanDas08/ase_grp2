import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
  } from '@tauri-apps/plugin-notification';
import TauriSVG from "../assets/tauri.svg";
import { FiAlignJustify } from "react-icons/fi";

interface NavbarProps {
    openNavbarMenu: () => void;
}

export default function Navbar({ openNavbarMenu }: NavbarProps) {
    const test = async () => {
        let permissionGranted = await isPermissionGranted();
        // Retrieve permission if not granted
        if (!permissionGranted) {
            const permission = await requestPermission();
            permissionGranted = permission === 'granted';
        }
        // Send notification if permission is granted
        if(permissionGranted) {
            sendNotification({ title: 'Tauri', body: 'Tauri is awesome!' });
        }
    }

    return(
        <div className="flex justify-between h-full w-full ps-5 pe-5 bg-gray-400">
            <div className="h-full w-2/3">
                <div className="h-full w-full flex items-center overflow-hidden bg-red-100">
                    <img src={TauriSVG} alt="Tauri Logo" className="h-full"/>
                    <div className="px-2 font-mono font-bold text-sm">Sustainable City Management Interface</div>
                </div>
            </div>
            <div className="flex h-full w-1/4 items-center justify-end px-5 bg-blue-200">
                <button className="navbarButton" onClick={openNavbarMenu}><FiAlignJustify /></button>
            </div>
        </div>
    )
}