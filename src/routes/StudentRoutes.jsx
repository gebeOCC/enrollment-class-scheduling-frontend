import { lazy } from "react";
import { Navigate, Route } from "react-router-dom"
const EnrollmentRecord = lazy(() => import("../pages/Student/EnrollmentRecord"));
const StudentClasses = lazy(() => import("../pages/Student/StudentClasses"));

const StudentRoutes = () => (
    <>
        <Route path="/classes" element={<StudentClasses />} />
        <Route path="/enrollment-record" element={<EnrollmentRecord />} />
        <Route path="*" element={<Navigate to="/classes" />} />
    </>
)

export default StudentRoutes