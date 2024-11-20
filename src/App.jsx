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
import EnrollStudent from "./pages/enrollment/EnrollStudent";
import StudentDetails from "./pages/Registrar/StudentDetails";
import EnrollmentRecord from "./pages/Student/EnrollmentRecord";
import FacultyDetails from "./pages/Registrar/FacultyDetails";
import Profile from "./pages/All/Profile";
import SectionsEnrolledStudents from "./pages/enrollment/SectionsEnrolledStudents";
import StudentCor from "./pages/enrollment/StudentCor";
import PhSchoolYearDetails from "./pages/ProgramHead/PhSchoolYearDetails";
import StudentSubjects from "./pages/enrollment/StudentSubjects";
import Schedule from "./pages/Schedule/Schedule";
import FacultySchedules from "./pages/enrollment/FacultySchedules";
import RoomSchedules from "./pages/enrollment/RoomSchedules";
import SchoolYearFacultySchedule from "./pages/ProgramHead/SchoolYearFacultySchedule";
import SchoolYearRoomSchedule from "./pages/ProgramHead/SchoolYearRoomSchedule";

function App() {
    const { userRole, enrollmentOngoing, preparation } = useAuth();

    const registrarRoutes = (
        <>
            <Route path="/" element={<Navigate to="/department" />} />
            <Route path="/department" element={<Department />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/faculty-list" element={<FacultyList />} />
            <Route path="/student-list" element={<StudentList />} />
            <Route path="/student-list/student-details" element={<StudentDetails />} />
            <Route path="/faculty-list/faculty-details" element={<FacultyDetails />} />
            <Route path="/school-year" element={<SchoolYear />} />
            <Route path="/school-year/:schoolYear/:semester" element={<SchoolYearDetails />} />
            <Route path="/classes" element={<FacultyClasses />} />
            <Route path="/classes/:classId" element={<CLassStudents />} />
            {(enrollmentOngoing || preparation) &&
                <>
                    <Route path="/enrollment/:courseid" element={<EnrollmentCourse />} />
                    <Route path="/enrollment/:courseid/enroll-student/:yearlevel" element={<EnrollStudent />} />
                    <Route path="/enrollment/:courseid/students/:yearlevel" element={<SectionsEnrolledStudents />} />
                    <Route path="/enrollment/:courseid/students/:yearlevel/:section/:studentid" element={<StudentCor />} />
                    <Route path="/enrollment/:courseid/students/:yearlevel/:section/subjects/:studentid" element={<StudentSubjects />} />
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
            <Route path="/school-year" element={<SchoolYear />} />
            <Route path="/school-year/:schoolYear/:semester" element={<PhSchoolYearDetails />} />
            <Route path="/school-year/:schoolYear/:semester/faculty-schedules" element={<SchoolYearFacultySchedule />} />
            <Route path="/school-year/:schoolYear/:semester/room-schedules" element={<SchoolYearRoomSchedule />} />
            {(enrollmentOngoing || preparation) &&
                <>
                    <Route path="/enrollment/:courseid" element={<EnrollmentCourse />} />
                    <Route path="/enrollment/:courseid/class/:yearlevel" element={<YearLevelSectionSubejcts />} />
                    <Route path="/enrollment/:courseid/enroll-student/:yearlevel" element={<EnrollStudent />} />
                    <Route path="/enrollment/:courseid/students/:yearlevel" element={<SectionsEnrolledStudents />} />
                    <Route path="/enrollment/:courseid/students/:yearlevel/:section/:studentid" element={<StudentCor />} />
                    <Route path="/enrollment/:courseid/students/:yearlevel/:section/subjects/:studentid" element={<StudentSubjects />} />
                    <Route path="/dashboard" element={<EnrollmentDashboardProgramHead />} />
                    <Route path="/room-schedules" element={<RoomSchedules />} />
                    <Route path="/faculty-schedules" element={<FacultySchedules />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
            }
            <Route path="/classes" element={<FacultyClasses />} />
            <Route path="/classes/:classId" element={<CLassStudents />} />
            <Route path="*" element={<Navigate to="/classes" />} />
        </>
    );

    const evaluatorRoutes = (
        <>
            <Route path="/" element={<Navigate to="/classes" />} />
            <Route path="/courses/:courseid" element={<CourseInfo />} />
            <Route path="/courses/:courseid/curriculum" element={<Curriculum />} />
            {(enrollmentOngoing || preparation) &&
                <>
                    <Route path="/enrollment/:courseid" element={<EnrollmentCourse />} />
                    <Route path="/enrollment/:courseid/class/:yearlevel" element={<YearLevelSectionSubejcts />} />
                    <Route path="/enrollment/:courseid/enroll-student/:yearlevel" element={<EnrollStudent />} />
                    <Route path="/enrollment/:courseid/students/:yearlevel" element={<SectionsEnrolledStudents />} />
                    <Route path="/enrollment/:courseid/students/:yearlevel/:section/:studentid" element={<StudentCor />} />
                    <Route path="/dashboard" element={<EnrollmentDashboardProgramHead />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
            }
            <Route path="/" element={<Navigate to="/classes" />} />
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
            <Route path="/enrollment-record" element={<EnrollmentRecord />} />
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
                            <Route path="/profile" element={<Profile />} />
                            {userRole === "registrar" && registrarRoutes}
                            {userRole === "program_head" && programHeadRoutes}
                            {userRole === "evaluator" && evaluatorRoutes}
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
