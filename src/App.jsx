import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "./components/SideBar";
import LoginPage from "./pages/Guest/LoginPage";
import Department from "./pages/registrar/department";
import Rooms from "./pages/Registrar/Rooms";
import FacultyList from "./pages/Registrar/facultyList";
import StudentList from "./pages/Registrar/StudentList";
import SchoolYear from "./pages/Registrar/SchoolYear";
import NotFound from "./pages/All/NotFound";
import SchoolYearDetails from "./pages/Registrar/SchoolYearDetails";
import { useAuth } from "./context/AuthContext";
import Courses from "./pages/ProgramHead/Courses";
import CourseInfo from "./pages/ProgramHead/CourseInfo";

function App() {
    const { userRole, fetching } = useAuth();
    console.log(userRole);

    if (fetching) {
        return <div></div>;
    }

    const registrarRoutes = (
        <>
            <Route path="/" element={<Navigate to="/department" />} />
            <Route path="/department" element={<Department />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/faculty-list" element={<FacultyList />} />
            <Route path="/student-list" element={<StudentList />} />
            <Route path="/school-year" element={<SchoolYear />} />
            <Route path="/school-year/:schoolYear/:semester" element={<SchoolYearDetails />} />
            <Route path="*" element={<Navigate to="/department" />} />
        </>
    );

    const programHeadRoutes = (
        <>
            <Route path="/" element={<Navigate to="/courses" />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseid" element={<CourseInfo />} />
            <Route path="*" element={<Navigate to="/courses" />} />
        </>
    );

    return (
        <BrowserRouter>
            <Routes>
                {!userRole ? (
                    <>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<SideBar />}>
                            {userRole === "registrar" && registrarRoutes}
                            {userRole === "program_head" && programHeadRoutes}
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
