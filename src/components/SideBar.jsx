import { Outlet, NavLink } from "react-router-dom";
import OCC_LOGO from '../images/OCC_LOGO.png';
import Header from "./Header";
import { useAuth } from "../context/AuthContext";

function SideBar() {
    const { userRole, fetching, enrollmentOngoing, courses } = useAuth();
    // console.log(userRole);

    if (fetching) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-[#3e5c76] text-white flex-shrink-0 flex flex-col justify-between">
                <div>
                    {/* Logo and Sidebar Title */}
                    <div className="p-4 flex items-center h-16">
                        <img src={OCC_LOGO} alt="Logo" className="w-12 h-12 mr-2" />
                        <h2 className="text-4xl font-bold">OCC</h2>
                    </div>

                    {/* Sidebar Links */}
                    <ul className="space-y-2">
                        {(() => {
                            if (userRole === "registrar") {
                                return (
                                    <>
                                        <li className="px-4 py-2">
                                            <NavLink
                                                to="/department"
                                                className={({ isActive }) =>
                                                    isActive ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2"
                                                }
                                            >
                                                <i className="fas fa-sitemap"></i>
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
                                                <span>Subjects</span>
                                            </NavLink>
                                        </li>
                                    </>
                                );
                            } else if (userRole === "program_head") {
                                return (
                                    <>
                                        <li className="px-4">
                                            <NavLink
                                                to="/courses"
                                                className={({ isActive }) =>
                                                    isActive ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2"
                                                        : "p-2 flex items-center space-x-2 py-2"
                                                }
                                            >
                                                <i className="fas fa-book"></i>
                                                <span>Courses</span>
                                            </NavLink>
                                        </li>
                                        {enrollmentOngoing &&
                                            <>
                                                <p className="px-4 text-sm text-gray-400">ENROLLMENT</p>
                                                {courses.map((course, index) => (
                                                    <li key={index} className="px-4">
                                                        <NavLink
                                                            to={`enrollment/${course.hashed_course_id}`}
                                                            className={({ isActive }) =>
                                                                isActive
                                                                    ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                    : "p-2 flex items-center space-x-2 py-2"
                                                            }
                                                        >
                                                            <i className="fas fa-calendar-alt"></i>
                                                            <span>{course.course_name_abbreviation}</span>
                                                        </NavLink>
                                                    </li>
                                                ))}
                                                <li className="px-4">
                                                    <NavLink
                                                        to="pre-enrollment"
                                                        className={({ isActive }) =>
                                                            isActive
                                                                ? "bg-[#3d7cb1] p-2 rounded-md flex items-center space-x-2 py-2"
                                                                : "p-2 flex items-center space-x-2 py-2"
                                                        }
                                                    >
                                                        <i className="fas fa-calendar-alt"></i>
                                                        <span>Pre Enrollment</span>
                                                    </NavLink>
                                                </li>
                                            </>
                                        }
                                    </>
                                )
                            }
                            return null;
                        })()}
                    </ul>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-grow">

                {/* Header */}
                <div className="h-16 bg-white text-black flex items-center justify-between px-4">
                    <Header />
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
