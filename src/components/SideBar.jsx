import { Outlet, NavLink } from "react-router-dom";
import OCC_LOGO from '../images/OCC_LOGO.png';

function SideBar() {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-[#3e5c76] text-white flex-shrink-0 flex flex-col justify-between">
                <div>
                    {/* Logo and Sidebar Title */}
                    <div className="p-4 flex items-center h-16 ">
                        <img src={OCC_LOGO} alt="Logo" className="w-12 h-12 mr-2" /> {/* Replace 'logo.png' with the path to your logo */}
                        <h2 className="text-4xl font-bold">OCC</h2>
                    </div>

                    {/* Sidebar Links */}
                    <ul className="space-y-2">
                        {/* Department */}
                        <li className="px-4 py-2">
                            <NavLink
                                to="/department"
                                className={({ isActive }) =>
                                    isActive ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2" 
                                    : "p-2 flex items-center space-x-2 py-2"
                                }
                            >
                                <i className="fas fa-sitemap"></i> {/* Example icon, use the correct icon class */}
                                {/* <svg width="35" height="28" viewBox="0 0 35 28" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <rect width="35" height="28" fill="url(#pattern0_66_4510)" />
                                    <defs>
                                        <pattern id="pattern0_66_4510" patternContentUnits="objectBoundingBox" width="1" height="1">
                                            <use xlink:href="#image0_66_4510" transform="matrix(0.0019802 0 0 0.00247525 -0.00693069 0)" />
                                        </pattern>
                                        </defs>
                                </svg> */}
                                <span>Department</span>
                            </NavLink>
                        </li>

                        {/* Enrollment Section */}
                        <p className="px-4 text-sm text-gray-400">ENROLLMENT</p>
                        <li className="px-4">
                            <NavLink
                                to="/school-year"
                                className={({ isActive }) =>
                                    isActive
                                        ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2"
                                        : "p-2 flex items-center space-x-2 py-2"
                                }
                            >
                                <i className="fas fa-calendar-alt"></i>
                                {/* <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.125 1.5V4.875M22.875 1.5V4.875M1.5 25.125V8.25C1.5 7.35489 1.85558 6.49645 2.48851 5.86351C3.12145 5.23058 3.97989 4.875 4.875 4.875H25.125C26.0201 4.875 26.8785 5.23058 27.5115 5.86351C28.1444 6.49645 28.5 7.35489 28.5 8.25V25.125M1.5 25.125C1.5 26.0201 1.85558 26.8785 2.48851 27.5115C3.12145 28.1444 3.97989 28.5 4.875 28.5H25.125C26.0201 28.5 26.8785 28.1444 27.5115 27.5115C28.1444 26.8785 28.5 26.0201 28.5 25.125M1.5 25.125V13.875C1.5 12.9799 1.85558 12.1215 2.48851 11.4885C3.12145 10.8556 3.97989 10.5 4.875 10.5H25.125C26.0201 10.5 26.8785 10.8556 27.5115 11.4885C28.1444 12.1215 28.5 12.9799 28.5 13.875V25.125M15 16.125H15.012V16.137H15V16.125ZM15 19.5H15.012V19.512H15V19.5ZM15 22.875H15.012V22.887H15V22.875ZM11.625 19.5H11.637V19.512H11.625V19.5ZM11.625 22.875H11.637V22.887H11.625V22.875ZM8.25 19.5H8.262V19.512H8.25V19.5ZM8.25 22.875H8.262V22.887H8.25V22.875ZM18.375 16.125H18.387V16.137H18.375V16.125ZM18.375 19.5H18.387V19.512H18.375V19.5ZM18.375 22.875H18.387V22.887H18.375V22.875ZM21.75 16.125H21.762V16.137H21.75V16.125ZM21.75 19.5H21.762V19.512H21.75V19.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" strokeLinecap="round" />
                                </svg> */}
                                <span>School year</span>
                            </NavLink>
                        </li>

                        {/* Scheduling Section */}
                        <p className="px-4 text-sm text-gray-400">SCHEDULING</p>
                        <li className="px-4">
                            <NavLink
                                to="/classes"
                                className={({ isActive }) =>
                                    isActive ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2" 
                                    : "p-2 flex items-center space-x-2 py-2"
                                }
                            >
                                <i className="fas fa-chalkboard-teacher"></i>
                                {/* <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <rect width="32" height="30" fill="url(#pattern0_177_5899)" />
                                    <defs>
                                        <pattern id="pattern0_177_5899" patternContentUnits="objectBoundingBox" width="1" height="1">
                                            <use xlink:href="#image0_177_5899" transform="matrix(0.00201613 0 0 0.00215054 0 -0.00537634)" />
                                        </pattern>
                                       </defs>
                                </svg> */}
                                <span>Classes</span>
                            </NavLink>
                        </li>

                        {/* People Section */}
                        <p className="px-4 pt-2 text-sm text-gray-400">PEOPLE</p>
                        <li className="px-4">
                            <NavLink
                                to="/faculty-list"
                                className={({ isActive }) =>
                                    isActive ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2" 
                                    : "p-2 flex items-center space-x-2 py-2"
                                }
                            >
                                <i className="fas fa-user-tie"></i>
                                {/* <svg width="19" height="28" viewBox="0 0 19 28" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <rect width="19" height="28" fill="url(#pattern0_29_2997)" />
                                    <defs>
                                        <pattern id="pattern0_29_2997" patternContentUnits="objectBoundingBox" width="1" height="1">
                                            <use xlink:href="#image0_29_2997" transform="matrix(0.00809717 0 0 0.00549451 -0.00202429 0)" />
                                        </pattern>
                                        </defs>
                                </svg> */}
                                <span>Faculty</span>
                            </NavLink>
                        </li>
                        <li className="px-4">
                            <NavLink
                                to="/student-list"
                                className={({ isActive }) =>
                                    isActive ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2" 
                                    : "p-2 flex items-center space-x-2 py-2"
                                }
                            >
                                <i className="fas fa-user-graduate"></i>
                                {/* <svg width="23" height="28" viewBox="0 0 23 28" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <rect width="23" height="28" fill="url(#pattern0_29_3205)" />
                                    <defs>
                                        <pattern id="pattern0_29_3205" patternContentUnits="objectBoundingBox" width="1" height="1">
                                            <use xlink:href="#image0_29_3205" transform="matrix(0.00454545 0 0 0.00373377 0 -0.00405844)" />
                                        </pattern>
                                        </defs>
                                </svg> */}
                                <span>Student</span>
                            </NavLink>
                        </li>

                        {/* Others Section */}
                        <p className="px-4 pt-2 text-sm text-gray-400">OTHERS</p>
                        <li className="px-4">
                            <NavLink
                                to="/rooms"
                                className={({ isActive }) =>
                                    isActive ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2" 
                                    : "p-2 flex items-center space-x-2 py-2"
                                }
                            >
                                <i className="fas fa-door-closed"></i>
                                {/* <svg width="36" height="28" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <rect width="36" height="28" fill="url(#pattern0_166_2183)" />
                                    <defs>
                                        <pattern id="pattern0_166_2183" patternContentUnits="objectBoundingBox" width="1" height="1">
                                            <use xlink:href="#image0_166_2183" transform="matrix(0.00322581 0 0 0.00414747 0 -0.00184332)" />
                                        </pattern>
                                        </defs>
                                </svg> */}
                                <span>Rooms</span>
                            </NavLink>
                        </li>
                        <li className="px-4">
                            <NavLink
                                to="/subjects"
                                className={({ isActive }) =>
                                    isActive ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2" 
                                    : "p-2 flex items-center space-x-2 py-2"
                                }
                            >
                                <i className="fas fa-book"></i>
                                {/* <svg width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 5.06301C12.5274 2.84505 9.3216 1.62043 6 1.62501C4.422 1.62501 2.907 1.89501 1.5 2.39301V23.768C2.94543 23.258 4.46725 22.9983 6 23C9.4575 23 12.612 24.3005 15 26.438M15 5.06301C17.4725 2.84493 20.6784 1.62029 24 1.62501C25.578 1.62501 27.093 1.89501 28.5 2.39301V23.768C27.0546 23.258 25.5328 22.9983 24 23C20.6784 22.9954 17.4726 24.2201 15 26.438M15 5.06301V26.438" stroke="white" stroke-width="1.5" stroke-linecap="round" strokeLinecap="round" />
                                </svg> */}
                                <span>Subjects</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-grow">
                {/* Header */}
                <div className="h-16 bg-white text-black flex items-center px-4">
                    <h1 className="text-xl font-semibold">Header</h1>
                </div>

                {/* Content */}
                <div className="flex-grow p-6 bg-[#F0F4F8] overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default SideBar;
