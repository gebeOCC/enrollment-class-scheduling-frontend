import { Outlet, Link } from "react-router-dom";
import "./SideBar.css"; // Import a CSS file for styling

function SideBar() {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-[#3e5c76] text-white flex-shrink-0">
                <div className="p-4">
                    <h2 className="text-lg font-semibold">OCC</h2>
                    <ul className="mt-4">
                        <li>
                            <Link to="/school-year">School year</Link>
                        </li>
                        <li>
                            <Link to="/department">Department</Link>
                        </li>
                        <li>
                            <Link to="/rooms">Rooms</Link>
                        </li>
                        <li>
                            <Link to="/faculty-list">Faculty</Link>
                        </li>
                        <li>
                            <Link to="/student-list">Student</Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-grow">
                {/* Header */}
                <div className="h-16 bg-white text-white flex items-center px-4">
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
