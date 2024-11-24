import { Navigate, Route } from "react-router-dom";
import { lazy } from "react";
const EnrollStudent = lazy(() => import("../pages/enrollment/EnrollStudent"));
const SectionsEnrolledStudents = lazy(() => import("../pages/enrollment/SectionsEnrolledStudents"));
const StudentCor = lazy(() => import("../pages/enrollment/StudentCor"));
const StudentSubjects = lazy(() => import("../pages/enrollment/StudentSubjects"));
const CLassStudents = lazy(() => import("../pages/Faculty/ClassStudents"));
const FacultyClasses = lazy(() => import("../pages/Faculty/FacultyClasses"));
const EnrollmentCourse = lazy(() => import("../pages/ProgramHead/EnrollmentCourse"));
const Department = lazy(() => import("../pages/Registrar/Department"));
const EnrollmentDashboardRegistrar = lazy(() => import("../pages/Registrar/EnrollmentDashboardRegistrar"));
const FacultyDetails = lazy(() => import("../pages/Registrar/FacultyDetails"));
const FacultyList = lazy(() => import("../pages/Registrar/FacultyList"));
const Rooms = lazy(() => import("../pages/Registrar/Rooms"));
const SchoolYear = lazy(() => import("../pages/Registrar/SchoolYear"));
const SchoolYearDetails = lazy(() => import("../pages/Registrar/SchoolYearDetails"));
const StudentDetails = lazy(() => import("../pages/Registrar/StudentDetails"));
const Studentlist = lazy(() => import("../pages/Registrar/StudentList"));

const RegistrarRoutes = ({ enrollmentOngoing, preparation }) => (
    <>
        <Route path="/" element={<Navigate to="/department" />} />
        <Route path="/department" element={<Department />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/faculty-list" element={<FacultyList />} />
        <Route path="/student-list" element={<Studentlist />} />
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
)

export default RegistrarRoutes;
