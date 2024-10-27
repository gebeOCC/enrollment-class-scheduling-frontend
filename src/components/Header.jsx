import { NavLink } from "react-router-dom";
import { useState } from "react";
import ProfilePic from '../images/OCC_LOGO.png';
import axiosInstance from "../../axios/axiosInstance";
import { HiBars3 } from "react-icons/hi2";
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
            <HiBars3 onClick={toggleSidebar} className="cursor-pointer transition-transform duration-300 ease-in-out transform
                hover:scale-110 active:scale-90" size={30} />

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
                        <div
                            onClick={logout}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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

