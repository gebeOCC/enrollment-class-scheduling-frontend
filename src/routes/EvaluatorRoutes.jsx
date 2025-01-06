import { Navigate, Route } from "react-router-dom"
import { lazy } from 'react'

const CourseInfo = lazy(() => import("../pages/ProgramHead/CourseInfo"))
const Curriculum = lazy(() => import("../pages/ProgramHead/Curriculum"))
const EnrollmentCourse = lazy(() => import("../pages/ProgramHead/EnrollmentCourse"))
const EnrollStudent = lazy(() => import("../pages/enrollment/EnrollStudent"))
const SectionsEnrolledStudents = lazy(() => import("../pages/enrollment/SectionsEnrolledStudents"))
const StudentCor = lazy(() => import("../pages/enrollment/StudentCor"))
const EnrollmentDashboardProgramHead = lazy(() => import("../pages/ProgramHead/EnrollmentDashboardProgramHead"))
const FacultyClasses = lazy(() => import("../pages/Faculty/FacultyClasses"))
const CLassStudents = lazy(() => import("../pages/Faculty/ClassStudents"))
const YearLevelSectionSubjects = lazy(() => import("../pages/ProgramHead/YearLevelSectionSubjects"))

const EvaluatorRoutes = ({ enrollmentOngoing, preparation }) => (
    <>
        <Route path="/" element={<Navigate to="/classes" />} />
        <Route path="/courses/:courseid" element={<CourseInfo />} />
        <Route path="/courses/:courseid/curriculum" element={<Curriculum />} />
        {(enrollmentOngoing || preparation) &&
            <>
                <Route path="/enrollment/:courseid" element={<EnrollmentCourse />} />
                <Route path="/enrollment/:courseid/class/:yearlevel" element={<YearLevelSectionSubjects />} />
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
)

export default EvaluatorRoutes