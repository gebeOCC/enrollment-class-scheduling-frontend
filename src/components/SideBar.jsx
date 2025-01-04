import { Suspense, useEffect, useState } from "react";
import { MdDashboard, MdMeetingRoom, MdOutlineDashboard, MdOutlineMeetingRoom } from "react-icons/md";
import { IoBook, IoBookOutline, IoCalendarOutline, IoCalendarSharp } from "react-icons/io5";
import { HiClipboardList, HiOutlineClipboardList } from "react-icons/hi";
import { BsBuildings, BsBuildingsFill } from "react-icons/bs";
import { GoPerson, GoPersonFill } from "react-icons/go";
import { HiBars3 } from "react-icons/hi2";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import OCC_LOGO from '../images/OCC_LOGO.png';
import Header from "./Header";
import { useAuth } from "../context/AuthContext";
import { formatDateShort } from "../utilities/utils";
import { PiChalkboardTeacher, PiChalkboardTeacherFill, PiNotebookDuotone, PiNotebookFill, PiStudent, PiStudentFill } from "react-icons/pi";
import FirstLoginModal from "../pages/All/FirstLoginModal";
import './SideBar.css'
import PreLoader from "./preloader/PreLoader";

function SideBar() {
    const { userRole, enrollmentOngoing, preparation, courses, enrollmentData, passwordChange } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [getScreen, setGetScreen] = useState(true);
    const location = useLocation();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const [onMobile, setOnMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 640) {
                setSidebarOpen(false);
                setOnMobile(true);
            } else if (window.innerWidth > 640 && onMobile) {
                setSidebarOpen(true);
                setOnMobile(false);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        setGetScreen(false);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (getScreen) return <></>

    return (
        <div className="flex h-svh overflow-hidden">
            <div className={`h-full fixed top-0 left-0 z-50  md:h-auto md:static bg-[#3e5c76] text-white flex-shrink-0 flex-col justify-between lg:block transition-all duration-200 ease-in-out ${sidebarOpen ? `'w-16 md:60 w-60` : `-translate-x-full md:translate-x-0 w-16`}`}>
                <aside className="flex flex-col h-full">
                    <div
                        className={`w-full p-2 flex items-center h-14 ${sidebarOpen ? 'space-x-2' : 'justify-center'} `}>
                        <HiBars3
                            onClick={toggleSidebar}
                            className="md:hidden cursor-pointer  transition-transform duration-300 ease-in-out transform w-10 h-10 active:scale-90"
                            size={30} />
                        <img
                            src={OCC_LOGO}
                            alt="Logo"
                            className="w-10 h-10" />
                        {sidebarOpen &&
                            <h2 className="text-4xl font-bold">
                                OCC
                            </h2>
                        }
                    </div>

                    <ul className={`flex-grow scrollable-container ${sidebarOpen ? 'py-4 px-2' : ''}`}>
                        {(() => {
                            if (userRole === "registrar") {
                                return (
                                    <>
                                        {(enrollmentOngoing || preparation) &&
                                            <>
                                                <div>
                                                    <div className={`${sidebarOpen ? 'p-2' : 'p-1'} rounded-lg bg-cyan-700 shadow-md mb-1`}>
                                                        {sidebarOpen ? (
                                                            <div>
                                                                {/* Enrollment Status */}
                                                                <p className="w-full text-sm font-bold text-white">
                                                                    ENROLLMENT{' '}
                                                                    <span className="text-gray-200 font-thin">
                                                                        {enrollmentOngoing && 'started'}
                                                                        {preparation && 'preparation'}
                                                                    </span>
                                                                </p>

                                                                {/* Enrollment Date Range */}
                                                                <p className="w-full text-xs italic text-gray-300">
                                                                    {`${formatDateShort(enrollmentData.start_date)} - ${formatDateShort(enrollmentData.end_date)}`}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {/* Enrollment Status */}
                                                                <p className="w-full font-bold text-white text-[8px]">
                                                                    ENROLLMENT
                                                                </p>
                                                            </div>
                                                        )
                                                        }

                                                        {/* Course List */}
                                                        <div>
                                                            {courses.map((course, index) => (
                                                                <li key={index} className="w-full">
                                                                    <NavLink
                                                                        to={`enrollment/${course.hashed_course_id}`}
                                                                        className={({ isActive }) =>
                                                                            isActive
                                                                                ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                                : "p-2 flex items-center rounded-md  space-x-2 py-2 duration-100 focus:bg-[#4e90ca]  hover:bg-[#3d7cb1]"  // Added hover state
                                                                        }
                                                                        onClick={() => {
                                                                            if (location.pathname !== `/enrollment/${course.hashed_course_id}` && onMobile) {
                                                                                setSidebarOpen(false);
                                                                            }
                                                                        }}
                                                                    >
                                                                        {({ isActive }) => (
                                                                            <>
                                                                                {sidebarOpen ? (
                                                                                    <>
                                                                                        {isActive ? <IoBook /> : <IoBookOutline />}
                                                                                        <span>{course.course_name_abbreviation}</span>
                                                                                    </>
                                                                                ) : (
                                                                                    <div className="w-full flex flex-col items-center">
                                                                                        {isActive ? <IoBook /> : <IoBookOutline />}
                                                                                        <span className="text-[8px]">{course.course_name_abbreviation}</span>
                                                                                    </div>
                                                                                )
                                                                                }
                                                                            </>
                                                                        )}
                                                                    </NavLink>
                                                                </li>
                                                            ))}
                                                            <li className="w-full">
                                                                <NavLink
                                                                    to="dashboard"
                                                                    className={({ isActive }) =>
                                                                        isActive
                                                                            ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                            : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                                    }
                                                                    onClick={() => {
                                                                        if (location.pathname !== '/dashboard' && onMobile) {
                                                                            setSidebarOpen(false);
                                                                        }
                                                                    }}
                                                                >
                                                                    {({ isActive }) => (
                                                                        <>
                                                                            {sidebarOpen ? (
                                                                                <>
                                                                                    {isActive ? <MdDashboard /> : <MdOutlineDashboard />}
                                                                                    <span>Dashboard</span>
                                                                                </>
                                                                            ) : (
                                                                                <div className="w-full flex flex-col items-center">
                                                                                    {isActive ? <MdDashboard /> : <MdOutlineDashboard />}
                                                                                    <span className="text-[8px]">Dashboard</span>
                                                                                </div>
                                                                            )
                                                                            }
                                                                        </>
                                                                    )}
                                                                </NavLink>
                                                            </li>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }

                                        <li>
                                            <NavLink
                                                to="/department"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                }
                                                onClick={() => {
                                                    if (location.pathname !== '/department' && onMobile) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {sidebarOpen ? (
                                                            <>
                                                                {isActive ? <BsBuildingsFill /> : <BsBuildings />}
                                                                <span>Department</span>
                                                            </>
                                                        ) : (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isActive ? <BsBuildingsFill /> : <BsBuildings />}
                                                                <span className="text-[8px]">Department</span>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>

                                        <li>
                                            <NavLink
                                                to="/school-year"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                }
                                                onClick={() => {
                                                    if (location.pathname !== '/school-year' && onMobile) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {sidebarOpen ? (
                                                            <>
                                                                {isActive ? <IoCalendarSharp /> : <IoCalendarOutline />}
                                                                <span>School year</span>
                                                            </>
                                                        ) : (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isActive ? <IoCalendarSharp /> : <IoCalendarOutline />}
                                                                <span className="text-[8px]">School year</span>
                                                            </div>
                                                        )
                                                        }
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>

                                        {/* Scheduling Section */}
                                        {sidebarOpen &&
                                            <p className="px-4 pt-2 text-sm text-gray-400">SCHEDULING</p>
                                        }
                                        <li>
                                            <NavLink
                                                to="/classes"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                }
                                                onClick={() => {
                                                    if (location.pathname !== '/classes' && onMobile) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {sidebarOpen ? (
                                                            <>
                                                                {isActive ? <PiChalkboardTeacherFill /> : <PiChalkboardTeacher />}
                                                                <span>Classes</span>
                                                            </>
                                                        ) : (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isActive ? <PiChalkboardTeacherFill /> : <PiChalkboardTeacher />}
                                                                <span className="text-[8px]">Classes</span>
                                                            </div>
                                                        )
                                                        }
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>

                                        {/* People Section */}
                                        {sidebarOpen &&
                                            <p className="px-4 pt-2 text-sm text-gray-400">PEOPLE</p>
                                        }
                                        <li>
                                            <NavLink
                                                to="/faculty-list"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                }
                                                onClick={() => {
                                                    if (location.pathname !== '/faculty-list' && onMobile) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {sidebarOpen ? (
                                                            <>
                                                                {isActive ? <GoPersonFill /> : <GoPerson />}
                                                                <span>Faculty</span>
                                                            </>
                                                        ) : (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isActive ? <GoPersonFill /> : <GoPerson />}
                                                                <span className="text-[8px]">Faculty</span>
                                                            </div>
                                                        )
                                                        }
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/student-list"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                }
                                                onClick={() => {
                                                    if (location.pathname !== '/student-list' && onMobile) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {sidebarOpen ? (
                                                            <>
                                                                {isActive ? <PiStudentFill /> : <PiStudent />}
                                                                <span>Student</span>
                                                            </>
                                                        ) : (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isActive ? <PiStudentFill /> : <PiStudent />}
                                                                <span className="text-[8px]">Student</span>
                                                            </div>
                                                        )
                                                        }
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>

                                        {/* Others Section */}

                                        {sidebarOpen &&
                                            <p className="px-4 pt-2 text-sm text-gray-400">OTHERS</p>
                                        }
                                        <li>
                                            <NavLink
                                                to="/rooms"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                }
                                                onClick={() => {
                                                    if (location.pathname !== '/rooms' && onMobile) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {sidebarOpen ? (
                                                            <>
                                                                {isActive ? <MdMeetingRoom /> : <MdOutlineMeetingRoom />}
                                                                <span>Rooms</span>
                                                            </>
                                                        ) : (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isActive ? <MdMeetingRoom /> : <MdOutlineMeetingRoom />}
                                                                <span className="text-[8px]">Rooms</span>
                                                            </div>
                                                        )
                                                        }
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>
                                    </>
                                );
                            } else if (userRole === "program_head") {
                                return (
                                    <>
                                        {(enrollmentOngoing || preparation) &&
                                            <>
                                                <div>
                                                    <div className={`${sidebarOpen ? 'p-2' : 'p-1'} rounded-lg bg-cyan-700 shadow-md mb-1`}>
                                                        {sidebarOpen ? (
                                                            <div>
                                                                {/* Enrollment Status */}
                                                                <p className="w-full text-sm font-bold text-white">
                                                                    ENROLLMENT{' '}
                                                                    <span className="text-gray-200 font-thin">
                                                                        {enrollmentOngoing && 'started'}
                                                                        {preparation && 'preparation'}
                                                                    </span>
                                                                </p>

                                                                {/* Enrollment Date Range */}
                                                                <p className="w-full text-xs italic text-gray-300">
                                                                    {`${formatDateShort(enrollmentData.start_date)} - ${formatDateShort(enrollmentData.end_date)}`}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {/* Enrollment Status */}
                                                                <p className="w-full font-bold text-white text-[8px]">
                                                                    ENROLLMENT
                                                                </p>
                                                            </div>
                                                        )

                                                        }

                                                        {/* Course List */}
                                                        <div>
                                                            {courses.map((course, index) => (
                                                                <li key={index} className="w-full">
                                                                    <NavLink
                                                                        to={`enrollment/${course.hashed_course_id}`}
                                                                        className={({ isActive }) =>
                                                                            isActive
                                                                                ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                                : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                                        }
                                                                        onClick={() => {
                                                                            if (location.pathname !== `/enrollment/${course.hashed_course_id}` && onMobile) {
                                                                                setSidebarOpen(false);
                                                                            }
                                                                        }}
                                                                    >
                                                                        {({ isActive }) => (
                                                                            <>
                                                                                {sidebarOpen ? (
                                                                                    <>
                                                                                        {isActive ? <IoBook /> : <IoBookOutline />}
                                                                                        <span>{course.course_name_abbreviation}</span>
                                                                                    </>
                                                                                ) : (
                                                                                    <div className="w-full flex flex-col items-center">
                                                                                        {isActive ? <IoBook /> : <IoBookOutline />}
                                                                                        <span className="text-[8px]">{course.course_name_abbreviation}</span>
                                                                                    </div>
                                                                                )
                                                                                }
                                                                            </>
                                                                        )}
                                                                    </NavLink>
                                                                </li>
                                                            ))}
                                                            <li className="w-full">
                                                                <NavLink
                                                                    to="dashboard"
                                                                    className={({ isActive }) =>
                                                                        isActive
                                                                            ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                            : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                                    }
                                                                    onClick={() => {
                                                                        if (location.pathname !== '/dashboard' && onMobile) {
                                                                            setSidebarOpen(false);
                                                                        }
                                                                    }}
                                                                >
                                                                    {({ isActive }) => (
                                                                        <>
                                                                            {sidebarOpen ? (
                                                                                <>
                                                                                    {isActive ? <MdDashboard /> : <MdOutlineDashboard />}
                                                                                    <span>Dashboard</span>
                                                                                </>
                                                                            ) : (
                                                                                <div className="w-full flex flex-col items-center">
                                                                                    {isActive ? <MdDashboard /> : <MdOutlineDashboard />}
                                                                                    <span className="text-[8px]">Dashboard</span>
                                                                                </div>
                                                                            )
                                                                            }
                                                                        </>
                                                                    )}
                                                                </NavLink>
                                                            </li>
                                                            {/* <p>Schedules</p> */}
                                                            <li className="w-full">
                                                                <NavLink
                                                                    to="room-schedules"
                                                                    className={({ isActive }) =>
                                                                        isActive
                                                                            ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                            : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                                    }
                                                                    onClick={() => {
                                                                        if (location.pathname !== '/room-schedules' && onMobile) {
                                                                            setSidebarOpen(false);
                                                                        }
                                                                    }}
                                                                >
                                                                    {({ isActive }) => (
                                                                        <>
                                                                            {sidebarOpen ? (
                                                                                <>
                                                                                    {isActive ? <MdMeetingRoom /> : <MdOutlineMeetingRoom />}
                                                                                    <span>Room</span>
                                                                                </>
                                                                            ) : (
                                                                                <div className="w-full flex flex-col items-center">
                                                                                    {isActive ? <MdMeetingRoom /> : <MdOutlineMeetingRoom />}
                                                                                    <span className="text-[8px]">Room</span>
                                                                                </div>
                                                                            )
                                                                            }
                                                                        </>
                                                                    )}
                                                                </NavLink>
                                                            </li>
                                                            <li className="w-full">
                                                                <NavLink
                                                                    to="faculty-schedules"
                                                                    className={({ isActive }) =>
                                                                        isActive
                                                                            ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                            : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                                    }
                                                                    onClick={() => {
                                                                        if (location.pathname !== '/room-schedules' && onMobile) {
                                                                            setSidebarOpen(false);
                                                                        }
                                                                    }}
                                                                >
                                                                    {({ isActive }) => (
                                                                        <>
                                                                            {sidebarOpen ? (
                                                                                <>
                                                                                    {isActive ? <GoPersonFill /> : <GoPerson />}
                                                                                    <span>Faculty</span>
                                                                                </>
                                                                            ) : (
                                                                                <div className="w-full flex flex-col items-center">
                                                                                    {isActive ? <GoPersonFill /> : <GoPerson />}
                                                                                    <span className="text-[8px]">Faculty</span>
                                                                                </div>
                                                                            )
                                                                            }
                                                                        </>
                                                                    )}
                                                                </NavLink>
                                                            </li>
                                                            <li className="w-full">
                                                                <NavLink
                                                                    to="subjects-schedules"
                                                                    className={({ isActive }) =>
                                                                        isActive
                                                                            ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                            : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                                    }
                                                                    onClick={() => {
                                                                        if (location.pathname !== '/subjects-schedules' && onMobile) {
                                                                            setSidebarOpen(false);
                                                                        }
                                                                    }}
                                                                >
                                                                    {({ isActive }) => (
                                                                        <>
                                                                            {sidebarOpen ? (
                                                                                <>
                                                                                    {isActive ? <PiNotebookFill /> : <PiNotebookDuotone />}
                                                                                    <span>Subjects</span>
                                                                                </>
                                                                            ) : (
                                                                                <div className="w-full flex flex-col items-center">
                                                                                    {isActive ? <PiNotebookFill /> : <PiNotebookDuotone />}
                                                                                    <span className="text-[8px]">Subjects</span>
                                                                                </div>
                                                                            )
                                                                            }
                                                                        </>
                                                                    )}
                                                                </NavLink>
                                                            </li>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        <li>
                                            <NavLink
                                                to="/school-year"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                }
                                                onClick={() => {
                                                    if (location.pathname !== '/school-year' && onMobile) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {sidebarOpen ? (
                                                            <>
                                                                {isActive ? <IoCalendarSharp /> : <IoCalendarOutline />}
                                                                <span>School year</span>
                                                            </>
                                                        ) : (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isActive ? <IoCalendarSharp /> : <IoCalendarOutline />}
                                                                <span className="text-[8px]">School year</span>
                                                            </div>
                                                        )
                                                        }
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/courses"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                }
                                                onClick={() => {
                                                    if (location.pathname !== '/faculty-list' && onMobile) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {sidebarOpen ? (
                                                            <>
                                                                {isActive ? <IoBook /> : <IoBookOutline />}
                                                                <span>Courses</span>
                                                            </>
                                                        ) : (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isActive ? <IoBook /> : <IoBookOutline />}
                                                                <span className="text-[8px]">Courses</span>
                                                            </div>
                                                        )
                                                        }
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/faculty-list"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                }
                                                onClick={() => {
                                                    if (location.pathname !== '/faculty-list' && onMobile) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {sidebarOpen ? (
                                                            <>
                                                                {isActive ? <GoPersonFill /> : <GoPerson />}
                                                                <span>Faculty List</span>
                                                            </>
                                                        ) : (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isActive ? <GoPersonFill /> : <GoPerson />}
                                                                <span className="text-[8px]">Faculty List</span>
                                                            </div>
                                                        )
                                                        }
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/classes"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                }
                                                onClick={() => {
                                                    if (location.pathname !== '/classes' && onMobile) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {sidebarOpen ? (
                                                            <>
                                                                {isActive ? <PiChalkboardTeacherFill /> : <PiChalkboardTeacher />}
                                                                <span>Classes</span>
                                                            </>
                                                        ) : (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isActive ? <PiChalkboardTeacherFill /> : <PiChalkboardTeacher />}
                                                                <span className="text-[8px]">Classes</span>
                                                            </div>
                                                        )
                                                        }
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>
                                    </>
                                )
                            } else if (userRole === "evaluator") {
                                return (
                                    <>
                                        {(enrollmentOngoing || preparation) &&
                                            <>
                                                <div>
                                                    <div className={`${sidebarOpen ? 'p-2' : 'p-1'} rounded-lg bg-cyan-700 shadow-md mb-1`}>
                                                        {sidebarOpen ? (
                                                            <div>
                                                                {/* Enrollment Status */}
                                                                <p className="w-full text-sm font-bold text-white">
                                                                    ENROLLMENT{' '}
                                                                    <span className="text-gray-200 font-thin">
                                                                        {enrollmentOngoing && 'started'}
                                                                        {preparation && 'preparation'}
                                                                    </span>
                                                                </p>

                                                                {/* Enrollment Date Range */}
                                                                <p className="w-full text-xs italic text-gray-300">
                                                                    {`${formatDateShort(enrollmentData.start_date)} - ${formatDateShort(enrollmentData.end_date)}`}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {/* Enrollment Status */}
                                                                <p className="w-full font-bold text-white text-[8px]">
                                                                    ENROLLMENT
                                                                </p>
                                                            </div>
                                                        )

                                                        }

                                                        {/* Course List */}
                                                        <div>
                                                            {courses.map((course, index) => (
                                                                <li key={index} className="w-full">
                                                                    <NavLink
                                                                        to={`enrollment/${course.hashed_course_id}`}
                                                                        className={({ isActive }) =>
                                                                            isActive
                                                                                ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                                : "p-2 flex items-center rounded-md  space-x-2 py-2 duration-100 focus:bg-[#4e90ca]  hover:bg-[#3d7cb1]"  // Added hover state
                                                                        }
                                                                        onClick={() => {
                                                                            if (location.pathname !== `/enrollment/${course.hashed_course_id}` && onMobile) {
                                                                                setSidebarOpen(false);
                                                                            }
                                                                        }}
                                                                    >
                                                                        {({ isActive }) => (
                                                                            <>
                                                                                {sidebarOpen ? (
                                                                                    <>
                                                                                        {isActive ? <IoBook /> : <IoBookOutline />}
                                                                                        <span>{course.course_name_abbreviation}</span>
                                                                                    </>
                                                                                ) : (
                                                                                    <div className="w-full flex flex-col items-center">
                                                                                        {isActive ? <IoBook /> : <IoBookOutline />}
                                                                                        <span className="text-[8px]">{course.course_name_abbreviation}</span>
                                                                                    </div>
                                                                                )
                                                                                }
                                                                            </>
                                                                        )}
                                                                    </NavLink>
                                                                </li>
                                                            ))}
                                                            <li className="w-full">
                                                                <NavLink
                                                                    to="dashboard"
                                                                    className={({ isActive }) =>
                                                                        isActive
                                                                            ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                            : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                                    }
                                                                    onClick={() => {
                                                                        if (location.pathname !== '/dashboard' && onMobile) {
                                                                            setSidebarOpen(false);
                                                                        }
                                                                    }}
                                                                >
                                                                    {({ isActive }) => (
                                                                        <>
                                                                            {sidebarOpen ? (
                                                                                <>
                                                                                    {isActive ? <MdDashboard /> : <MdOutlineDashboard />}
                                                                                    <span>Dashboard</span>
                                                                                </>
                                                                            ) : (
                                                                                <div className="w-full flex flex-col items-center">
                                                                                    {isActive ? <MdDashboard /> : <MdOutlineDashboard />}
                                                                                    <span className="text-[8px]">Dashboard</span>
                                                                                </div>
                                                                            )
                                                                            }
                                                                        </>
                                                                    )}
                                                                </NavLink>
                                                            </li>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        <li>
                                            <NavLink
                                                to="/classes"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                }
                                                onClick={() => {
                                                    if (location.pathname !== '/classes' && onMobile) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {sidebarOpen ? (
                                                            <>
                                                                {isActive ? <PiChalkboardTeacherFill /> : <PiChalkboardTeacher />}
                                                                <span>Classes</span>
                                                            </>
                                                        ) : (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isActive ? <PiChalkboardTeacherFill /> : <PiChalkboardTeacher />}
                                                                <span className="text-[8px]">Classes</span>
                                                            </div>
                                                        )
                                                        }
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>
                                    </>
                                )
                            } else if (userRole === "faculty") {
                                return (
                                    <>
                                        <li>
                                            <NavLink
                                                to="/classes"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                }
                                                onClick={() => {
                                                    if (location.pathname !== '/classes' && onMobile) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {sidebarOpen ? (
                                                            <>
                                                                {isActive ? <PiChalkboardTeacherFill /> : <PiChalkboardTeacher />}
                                                                <span>Classes</span>
                                                            </>
                                                        ) : (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isActive ? <PiChalkboardTeacherFill /> : <PiChalkboardTeacher />}
                                                                <span className="text-[8px]">Classes</span>
                                                            </div>
                                                        )
                                                        }
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>
                                    </>
                                )
                            } else if (userRole === "student") {
                                return (
                                    <>
                                        <li>
                                            <NavLink
                                                to="/classes"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                }
                                                onClick={() => {
                                                    if (location.pathname !== '/classes' && onMobile) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {sidebarOpen ? (
                                                            <>
                                                                {isActive ? <PiChalkboardTeacherFill /> : <PiChalkboardTeacher />}
                                                                <span>Classes</span>
                                                            </>
                                                        ) : (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isActive ? <PiChalkboardTeacherFill /> : <PiChalkboardTeacher />}
                                                                <span className="text-[8px]">Classes</span>
                                                            </div>
                                                        )
                                                        }
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/enrollment-record"
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "bg-[#539ad8] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2 rounded-md duration-100 focus:bg-[#4e90ca] hover:bg-[#3d7cb1]"
                                                }
                                                onClick={() => {
                                                    if (location.pathname !== '/enrollment-record' && onMobile) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {sidebarOpen ? (
                                                            <>
                                                                {isActive ? <HiClipboardList /> : <HiOutlineClipboardList />}
                                                                <span>Enrollment Record</span>
                                                            </>
                                                        ) : (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isActive ? <HiClipboardList /> : <HiOutlineClipboardList />}
                                                                <span className="text-[8px] text-center">Enrollment Record</span>
                                                            </div>
                                                        )
                                                        }
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>
                                    </>
                                )
                            }
                            return null;
                        })()}
                    </ul >
                </aside >
            </div >

            <div className="flex flex-col flex-grow">
                <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

                <div className="flex-grow p-4 bg-[#F0F4F8] overflow-auto">
                    <Suspense fallback={<PreLoader />}>
                        {/* This renders the nested routes */}
                        <Outlet />
                    </Suspense>
                </div>
            </div>


            {(location.pathname !== '/profile' && !passwordChange) &&
                <FirstLoginModal />
            }
        </div >
    );
}

export default SideBar;
