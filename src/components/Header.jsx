import { NavLink } from "react-router-dom";
import { useState } from "react";
import ProfilePic from '../images/OCC_LOGO.png';
import axiosInstance from "../../axios/axiosInstance";

function Header({ sidebarOpen, toggleSidebar }) {
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
            <svg onClick={toggleSidebar} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer transition-transform duration-300 ease-in-out transform rotate-0">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={`${sidebarOpen ? 'm18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5' : 'm5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5'}`}
                    className={`transition-opacity duration-300 ease-in-out`}
                />
            </svg>


            {/* Profile Picture and Dropdown */}
            <div className="relative">
                <img
                    src={ProfilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full cursor-pointer"
                    onClick={toggleDropdown}
                />
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                        <NavLink
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Profile
                        </NavLink>
                        <NavLink
                            onClick={logout}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Logout
                        </NavLink>
                    </div>
                )}
            </div>
        </>
    )
}

export default Header;

