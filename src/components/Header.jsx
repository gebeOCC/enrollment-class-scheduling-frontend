import { NavLink } from "react-router-dom";
import { useState } from "react";
import ProfilePic from '../images/OCC_LOGO.png';
import axiosInstance from "../../axios/axiosInstance";
import { HiBars3 } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
function Header({ toggleSidebar }) {
    const { firstName } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const logout = async () => {
        console.log('logout')
        await axiosInstance.post(`/logout`)
            .then(response => {
                if (response.data.message === 'success') {
                    window.location.reload();
                }
            })
    }

    return (
        <>
            {/* Header */}
            <HiBars3 onClick={toggleSidebar} className="cursor-pointer transition-transform duration-300 ease-in-out transform
                hover:scale-110 active:scale-90" size={30} />

            {/* Profile Picture and Dropdown */}
            <div className="relative">
                {/* Profile Picture */}
                <div
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-blue-600 cursor-pointer"
                    onClick={toggleDropdown}
                >
                    <span className="text-2xl font-semibold text-blue-600">
                        {firstName[0].toUpperCase()}
                    </span>
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                        <NavLink
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
                        >
                            Profile
                        </NavLink>
                        <div
                            onClick={logout}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 cursor-pointer"
                        >
                            Logout
                        </div>
                    </div>
                )}
            </div>

        </>
    )
}

export default Header;

