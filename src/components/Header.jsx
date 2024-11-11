import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ProfilePic from '../images/OCC_LOGO.png';
import axiosInstance from "../../axios/axiosInstance";
import { HiBars3 } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
function Header({ toggleSidebar }) {
    const { firstName } = useAuth();
    const[dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                w-10 h-10 hover:scale-110 active:scale-90" size={30} />

            {/* Profile Picture and Dropdown */}
            <div className="relative"  ref={dropdownRef}>
                {/* Profile Picture with Radiant Ring */}
                <div
                    className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md transition-transform duration-200 ease-in-out hover:scale-105"
                    onClick={toggleDropdown}
                >
                    {/* Radiant Ring */}
                    <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                        <div className="w-full h-full bg-white rounded-full"></div>
                    </div>

                    {/* Initials */}
                    <span className="relative text-xl font-semibold text-blue-600">
                        {firstName[0].toUpperCase()}
                    </span>
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 transition-opacity duration-200 ease-out opacity-100">
                    <NavLink
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 rounded-t-md"
                        onClick={() => setDropdownOpen(false)}
                    >
                        Profile
                    </NavLink>
                    <div
                        onClick={() => {logout(); setDropdownOpen(false);}}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 cursor-pointer rounded-b-md"
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

