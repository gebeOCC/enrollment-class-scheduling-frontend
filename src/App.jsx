import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import SideBar from "./components/SideBar";
import LoginPage from "./pages/Guest/LoginPage";
import Department from "./pages/Registrar/Department";
import Rooms from "./pages/Registrar/Rooms";
import FacultyList from "./pages/Registrar/FacultyList";
import StudentList from "./pages/Registrar/StudentList";
import SchoolYear from "./pages/Registrar/SchoolYear";
import NotFound from "./pages/All/NotFound";
import SchoolYearDetails from "./pages/Registrar/SchoolYearDetails";
import Courses from "./pages/ProgramHead/Courses";
import CourseInfo from "./pages/ProgramHead/CourseInfo";
import Curriculum from "./pages/ProgramHead/Curriculum";
import EnrollmentCourse from "./pages/ProgramHead/EnrollmentCourse";
import YearLevelSectionSubejcts from "./pages/ProgramHead/YearLevelSectionSubjects";
import FacultyClasses from "./pages/Faculty/FacultyClasses";
import CLassStudents from "./pages/Faculty/ClassStudents";
import EnrollmentDashboardRegistrar from "./pages/Registrar/EnrollmentDashboardRegistrar";
import EnrollmentDashboardProgramHead from "./pages/ProgramHead/EnrollmentDashboardProgramHead";
import StudentClasses from "./pages/Student/StudentClasses";
import PhFacultyList from "./pages/ProgramHead/PhFacultyList";

function App() {
    const { userRole, enrollmentOngoing, preparation } = useAuth();

    const registrarRoutes = (
        <>
            <Route path="/" element={<Navigate to="/department" />} />
            <Route path="/department" element={<Department />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/faculty-list" element={<FacultyList />} />
            <Route path="/student-list" element={<StudentList />} />
            <Route path="/school-year" element={<SchoolYear />} />
            <Route path="/school-year/:schoolYear/:semester" element={<SchoolYearDetails />} />
            <Route path="/classes" element={<FacultyClasses />} />
            <Route path="/classes/:classId" element={<CLassStudents />} />
            {(enrollmentOngoing || preparation) &&
                <>
                    <Route path="/dashboard" element={<EnrollmentDashboardRegistrar />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
            }
            <Route path="*" element={<Navigate to="/classes" />} />
        </>
    );

    const programHeadRoutes = (
        <>
            <Route path="/" element={<Navigate to="/courses" />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseid" element={<CourseInfo />} />
            <Route path="/courses/:courseid/curriculum" element={<Curriculum />} />
            <Route path="/faculty-list" element={<PhFacultyList />} />
            {(enrollmentOngoing || preparation) &&
                <>
                    <Route path="/enrollment/:courseid" element={<EnrollmentCourse />} />
                    <Route path="/enrollment/:courseid/:yearlevel" element={<YearLevelSectionSubejcts />} />
                    <Route path="/dashboard" element={<EnrollmentDashboardProgramHead />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
            }
            <Route path="/classes" element={<FacultyClasses />} />
            <Route path="/classes/:classId" element={<CLassStudents />} />
            <Route path="*" element={<Navigate to="/classes" />} />
        </>
    );

    const FacultyRoutes = (
        <>
            <Route path="/classes" element={<FacultyClasses />} />
            <Route path="/classes/:classId" element={<CLassStudents />} />
            <Route path="*" element={<Navigate to="/classes" />} />
        </>
    );

    const studentRoutes = (
        <>
            <Route path="/classes" element={<StudentClasses />} />
            <Route path="*" element={<Navigate to="/classes" />} />
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
                            {userRole === "faculty" && FacultyRoutes}
                            {userRole === "student" && studentRoutes}
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
