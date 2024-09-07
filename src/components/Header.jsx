import { NavLink } from "react-router-dom";
import { useState } from "react";
import ProfilePic from '../images/OCC_LOGO.png';
import axiosInstance from "../../axios/axiosInstance";

function Header() {
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
            <h1 className="text-xl font-semibold"></h1>

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

