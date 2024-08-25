import { Routes, Route } from "react-router-dom";
import Department from "../pages/registrar/department";
import Rooms from "../pages/Registrar/rooms";
import FacultyList from "../pages/Registrar/facultyList";
import Studentlist from "../pages/Registrar/studentList";
import SchoolYear from "../pages/Registrar/schoolYear";

function RegistrarRoutes() {
    return (
        <Routes>
            {/* Define all routes related to registrar here */}
            <Route path="/department" element={<Department />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/faculty-list" element={<FacultyList />} />
            <Route path="/student-list" element={<Studentlist />} />
            <Route path="/school-year" element={<SchoolYear />} />
        </Routes>
    );
}

export default RegistrarRoutes;
