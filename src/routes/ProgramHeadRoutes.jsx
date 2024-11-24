import { Navigate, Route } from "react-router-dom"
import { lazy } from 'react'
const Courses = lazy(() => import("../pages/ProgramHead/Courses"));
const CourseInfo = lazy(() => import("../pages/ProgramHead/CourseInfo"));
const Curriculum = lazy(() => import("../pages/ProgramHead/Curriculum"));
const PhFacultyList = lazy(() => import("../pages/ProgramHead/PhFacultyList"));
const SchoolYear = lazy(() => import("../pages/Registrar/SchoolYear"));
const PhSchoolYearDetails = lazy(() => import("../pages/ProgramHead/PhSchoolYearDetails"));
const SchoolYearFacultySchedule = lazy(() => import("../pages/ProgramHead/SchoolYearFacultySchedule"));
const SchoolYearRoomSchedule = lazy(() => import("../pages/ProgramHead/SchoolYearRoomSchedule"));
const EnrollmentCourse = lazy(() => import("../pages/ProgramHead/EnrollmentCourse"));
const YearLevelSectionSubjects = lazy(() => import("../pages/ProgramHead/YearLevelSectionSubjects"));
const EnrollStudent = lazy(() => import("../pages/enrollment/EnrollStudent"));
const SectionsEnrolledStudents = lazy(() => import("../pages/enrollment/SectionsEnrolledStudents"));
const StudentCor = lazy(() => import("../pages/enrollment/StudentCor"));
const StudentSubjects = lazy(() => import("../pages/enrollment/StudentSubjects"));
const EnrollmentDashboardProgramHead = lazy(() => import("../pages/ProgramHead/EnrollmentDashboardProgramHead"));
const RoomSchedules = lazy(() => import("../pages/enrollment/RoomSchedules"));
const FacultySchedules = lazy(() => import("../pages/enrollment/FacultySchedules"));
const FacultyClasses = lazy(() => import("../pages/Faculty/FacultyClasses"));
const CLassStudents = lazy(() => import("../pages/Faculty/ClassStudents"));

const ProgramHeadRoutes = ({ enrollmentOngoing, preparation }) => (
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
                <Route path="/enrollment/:courseid/class/:yearlevel" element={<YearLevelSectionSubjects />} />
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
)

export default ProgramHeadRoutes