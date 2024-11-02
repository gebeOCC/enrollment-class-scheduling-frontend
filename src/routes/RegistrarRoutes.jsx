import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Department from "../pages/Registrar/Department";
import FacultyList from "../pages/Registrar/FacultyList";
import StudentDetails from "../pages/Registrar/StudentDetails";
import SchoolYear from "../pages/Registrar/SchoolYear";
import SchoolYearDetails from "../pages/Registrar/SchoolYearDetails";
import FacultyClasses from "../pages/Faculty/FacultyClasses";
import CLassStudents from "../pages/Faculty/ClassStudents";
import EnrollmentDashboardRegistrar from "../pages/Registrar/EnrollmentDashboardRegistrar";
import Rooms from "../pages/Registrar/Rooms";
import Studentlist from "../pages/Registrar/StudentList";
import NotFound from "../pages/All/NotFound";

function RegistrarRoutes({ enrollmentOngoing, preparation }) {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SideBar />}>
                    <Route path="/" element={<Navigate to="/department" />} />
                    <Route path="/department" element={<Department />} />
                    <Route path="/rooms" element={<Rooms />} />
                    <Route path="/faculty-list" element={<FacultyList />} />
                    <Route path="/student-list" element={<Studentlist />} />
                    <Route path="/student-list/student-details" element={<StudentDetails />} />
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
                    <Route path="/*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RegistrarRoutes;
