import { lazy } from 'react'
import { Navigate, Route } from 'react-router-dom'
const CLassStudents = lazy(() => import("../pages/Faculty/ClassStudents"))
const FacultyClasses = lazy(() => import("../pages/Faculty/FacultyClasses"))

const FacultyRoutes = () => (
    <>
        <Route path="/classes" element={<FacultyClasses />} />
        <Route path="/classes/:classId" element={<CLassStudents />} />
        <Route path="*" element={<Navigate to="/classes" />} />
    </>
)

export default FacultyRoutes
