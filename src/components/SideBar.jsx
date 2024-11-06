import { Outlet, NavLink } from "react-router-dom";
import OCC_LOGO from '../images/OCC_LOGO.png';
import Header from "./Header";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { formatDate, formatDateShort } from "../utilities/utils";
import { HiBars3 } from "react-icons/hi2";

function SideBar() {
    const { userRole, fetching, enrollmentOngoing, preparation, courses, enrollmentData } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 640) {
                setSidebarOpen(false);
            } else if (window.innerWidth > 640 && window.innerWidth < 650) {
                setSidebarOpen(true);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (fetching) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <div className={`h-full fixed top-0 left-0 z-50 md:h-auto md:static bg-[#3e5c76] text-white flex-shrink-0 flex-col justify-between lg:block transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-20 hidden md:block'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-4 flex items-center h-14">
                        <HiBars3 onClick={toggleSidebar} className="md:hidden cursor-pointer  transition-transform duration-300 ease-in-out transform
                hover:scale-110 active:scale-90" size={30} />
                        <img src={OCC_LOGO} alt="Logo" className="w-8 h-8 mr-2" />
                        {sidebarOpen && <h2 className="text-3xl font-bold">OCC</h2>}
                    </div>

                    <ul className="space-y-1 flex-grow overflow-x-hidden py-4">
                        {(() => {
                            if (userRole === "registrar") {
                                return (
                                    <>
                                        {(enrollmentOngoing || preparation) &&
                                            <>
                                                <div className="px-2">
                                                    <div className="py-4 rounded-lg bg-cyan-700 shadow-md">
                                                        {/* Enrollment Status */}
                                                        <p className="px-4 text-sm font-bold text-white">
                                                            ENROLLMENT{' '}
                                                            <span className="text-gray-200 font-thin">
                                                                {(!enrollmentOngoing && preparation) ? 'preparation' : 'started'}
                                                            </span>
                                                        </p>

                                                        {/* Enrollment Date Range */}
                                                        <p className="px-4 text-xs italic text-gray-300 mb-3">
                                                            {`${formatDateShort(enrollmentData.start_date)} - ${formatDateShort(enrollmentData.end_date)}`}

                                                        </p>

                                                        {/* Course List */}
                                                        <div className="space-y-1">
                                                            {courses.map((course, index) => (
                                                                <li key={index} className="px-4">
                                                                    <NavLink
                                                                        to={`enrollment/${course.hashed_course_id}`}
                                                                        className={({ isActive }) =>
                                                                            isActive
                                                                                ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                                : "p-2 flex items-center rounded-md  space-x-2 py-2 duration-100 focus:bg-[#4e90ca]  hover:bg-[#3d7cb1]"  // Added hover state
                                                                        }
                                                                    >
                                                                        <i className="fas fa-calendar-alt text-white"></i>
                                                                        <span className="text-white">{course.course_name_abbreviation}</span>
                                                                    </NavLink>
                                                                </li>
                                                            ))}
                                                            <li className="px-4">
                                                                <NavLink
                                                                    to="dashboard"
                                                                    className={({ isActive }) =>
                                                                        isActive
                                                                            ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                            : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                                    }
                                                                >
                                                                    <i className="fas fa-calendar-alt"></i>
                                                                    <span>Dashboard</span>
                                                                </NavLink>
                                                            </li>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }

                                        <li className="px-4 py">
                                            <NavLink
                                                to="/department"
                                                className={({ isActive }) =>
                                                    isActive ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2  duration-100 hover:bg-[#3d7cb1] rounded-md"
                                                }
                                            >
                                                <i className="fas fa-sitemap"></i>
                                                <span>Department</span>
                                            </NavLink>
                                        </li>

                                        <li className="px-4">
                                            <NavLink
                                                to="/school-year"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 hover:bg-[#3d7cb1] rounded-md"
                                                }
                                            >
                                                <i className="fas fa-calendar-alt"></i>
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
                                                        : "p-2 flex items-center space-x-2 py-2 hover:bg-[#3d7cb1] rounded-md"
                                                }
                                            >
                                                <i className="fas fa-chalkboard-teacher"></i>
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
                                                        : "p-2 flex items-center space-x-2 py-2 hover:bg-[#3d7cb1] rounded-md"
                                                }
                                            >
                                                <i className="fas fa-user-tie"></i>
                                                <span>Faculty</span>
                                            </NavLink>
                                        </li>
                                        <li className="px-4">
                                            <NavLink
                                                to="/student-list"
                                                className={({ isActive }) =>
                                                    isActive ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 hover:bg-[#3d7cb1] rounded-md"
                                                }
                                            >
                                                <i className="fas fa-user-graduate"></i>
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
                                                        : "p-2 flex items-center space-x-2 py-2 hover:bg-[#3d7cb1] rounded-md"
                                                }
                                            >
                                                <i className="fas fa-door-closed"></i>
                                                <span>Rooms</span>
                                            </NavLink>
                                        </li>
                                        <li className="px-4">
                                            <NavLink
                                                to="/subjects"
                                                className={({ isActive }) =>
                                                    isActive ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 hover:bg-[#3d7cb1] rounded-md"
                                                }
                                            >
                                                <i className="fas fa-book"></i>
                                                <span>Subjects</span>
                                            </NavLink>
                                        </li>
                                    </>
                                );
                            } else if (userRole === "program_head") {
                                return (
                                    <>
                                        {(enrollmentOngoing || preparation) &&
                                            <>
                                                <div className="px-2">
                                                    <div className="py-4 rounded-lg bg-cyan-700 shadow-md">
                                                        {/* Enrollment Status */}
                                                        <p className="px-4 text-sm font-bold text-white">
                                                            ENROLLMENT{' '}
                                                            <span className="text-gray-200 font-thin">
                                                                {(!enrollmentOngoing && preparation) ? 'preparation' : 'started'}
                                                            </span>
                                                        </p>

                                                        {/* Enrollment Date Range */}
                                                        <p className="px-4 text-xs italic text-gray-300 mb-3">
                                                            {formatDate(enrollmentData.start_date)} - {formatDate(enrollmentData.end_date)}
                                                        </p>

                                                        {/* Course List */}
                                                        <div className="space-y-1">
                                                            {courses.map((course, index) => (
                                                                <li key={index} className="px-4">
                                                                    <NavLink
                                                                        to={`enrollment/${course.hashed_course_id}`}
                                                                        className={({ isActive }) =>
                                                                            isActive
                                                                                ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                                : "p-2 flex items-center rounded-md  space-x-2 py-2 duration-100 focus:bg-[#4e90ca]  hover:bg-[#3d7cb1]"  // Added hover state
                                                                        }
                                                                    >
                                                                        <i className="fas fa-calendar-alt text-white"></i>
                                                                        <span className="text-white">{course.course_name_abbreviation}</span>
                                                                    </NavLink>
                                                                </li>
                                                            ))}
                                                            <li className="px-4">
                                                                <NavLink
                                                                    to="dashboard"
                                                                    className={({ isActive }) =>
                                                                        isActive
                                                                            ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                            : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                                    }
                                                                >
                                                                    <i className="fas fa-calendar-alt"></i>
                                                                    <span>Dashboard</span>
                                                                </NavLink>
                                                            </li>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }

                                        <div className="px-2">
                                            <NavLink
                                                to="/courses"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center rounded-md  space-x-2 py-2 duration-100 focus:bg-[#4e90ca]  hover:bg-[#3d7cb1]"
                                                }
                                            >
                                                <i className="fas fa-book"></i>
                                                <span>Courses</span>
                                            </NavLink>
                                        </div>
                                        <li className="px-2">
                                            <NavLink
                                                to="/faculty-list"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center rounded-md  space-x-2 py-2 duration-100 focus:bg-[#4e90ca]  hover:bg-[#3d7cb1]"
                                                }
                                            >
                                                <i className="fas fa-user-tie"></i>
                                                <span>Faculty</span>
                                            </NavLink>
                                        </li>
                                        <li className="px-2">
                                            <NavLink
                                                to="/classes"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center rounded-md  space-x-2 py-2 duration-100 focus:bg-[#4e90ca]  hover:bg-[#3d7cb1]"
                                                }
                                            >
                                                <i className="fas fa-book"></i>
                                                <span>Classes</span>
                                            </NavLink>
                                        </li>
                                    </>
                                )
                            } else if (userRole === "evaluator") {
                                return (
                                    <>
                                        {(enrollmentOngoing || preparation) &&
                                            <>
                                                <div className="px-2">
                                                    <div className="py-4 rounded-lg bg-cyan-700 shadow-md">
                                                        {/* Enrollment Status */}
                                                        <p className="px-4 text-sm font-bold text-white">
                                                            ENROLLMENT{' '}
                                                            <span className="text-gray-200 font-thin">
                                                                {(!enrollmentOngoing && preparation) ? 'preparation' : 'started'}
                                                            </span>
                                                        </p>

                                                        {/* Enrollment Date Range */}
                                                        <p className="px-4 text-xs italic text-gray-300 mb-3">
                                                            {formatDate(enrollmentData.start_date)} - {formatDate(enrollmentData.end_date)}
                                                        </p>

                                                        {/* Course List */}
                                                        <div className="space-y-1">
                                                            {courses.map((course, index) => (
                                                                <li key={index} className="px-4">
                                                                    <NavLink
                                                                        to={`enrollment/${course.hashed_course_id}`}
                                                                        className={({ isActive }) =>
                                                                            isActive
                                                                                ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                                : "p-2 flex items-center rounded-md  space-x-2 py-2 duration-100 focus:bg-[#4e90ca]  hover:bg-[#3d7cb1]"  // Added hover state
                                                                        }
                                                                    >
                                                                        <i className="fas fa-calendar-alt text-white"></i>
                                                                        <span className="text-white">{course.course_name_abbreviation}</span>
                                                                    </NavLink>
                                                                </li>
                                                            ))}
                                                            <li className="px-4">
                                                                <NavLink
                                                                    to="dashboard"
                                                                    className={({ isActive }) =>
                                                                        isActive
                                                                            ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                            : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                                    }
                                                                >
                                                                    <i className="fas fa-calendar-alt"></i>
                                                                    <span>Dashboard</span>
                                                                </NavLink>
                                                            </li>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        <li className="px-2">
                                            <NavLink
                                                to="/classes"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center rounded-md  space-x-2 py-2 duration-100 focus:bg-[#4e90ca]  hover:bg-[#3d7cb1]"
                                                }
                                            >
                                                <i className="fas fa-book"></i>
                                                <span>Classes</span>
                                            </NavLink>
                                        </li>
                                    </>
                                )
                            } else if (userRole === "faculty") {
                                return (
                                    <>
                                        <li className="px-4">
                                            <NavLink
                                                to="/classes"
                                                className={({ isActive }) =>
                                                    isActive ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2"
                                                }
                                            >
                                                <i className="fas fa-book"></i>
                                                <span>Classes</span>
                                            </NavLink>
                                        </li>
                                    </>
                                )
                            } else if (userRole === "student") {
                                return (
                                    <>
                                        <li className="px-4">
                                            <NavLink
                                                to="/classes"
                                                className={({ isActive }) =>
                                                    isActive ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center rounded-md  space-x-2 py-2 duration-100 focus:bg-[#4e90ca]  hover:bg-[#3d7cb1]"
                                                }
                                            >
                                                <span>Classes</span>
                                            </NavLink>
                                        </li>
                                        <li className="px-4">
                                            <NavLink
                                                to="/enrollment-record"
                                                className={({ isActive }) =>
                                                    isActive ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center rounded-md  space-x-2 py-2 duration-100 focus:bg-[#4e90ca]  hover:bg-[#3d7cb1]"
                                                }
                                            >
                                                <span>Enrollment Record</span>
                                            </NavLink>
                                        </li>
                                    </>
                                )
                            }
                            return null;
                        })()}
                    </ul >
                </div >
            </div >

            < div className="flex flex-col flex-grow" >
                < div className="h-14 max-h-14 min-h-14 bg-white text-black flex items-center justify-between px-4" >
                    <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                </div >

                < div className="flex-grow p-4 bg-[#F0F4F8] overflow-auto" >
                    <Outlet />
                </div >
            </div >
        </div >
    );
}

export default SideBar;
