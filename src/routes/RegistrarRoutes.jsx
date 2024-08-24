import { BrowserRouter, Routes, Route } from "react-router-dom";
import Department from "../pages/registrar/department";
import SideBar from "../components/SideBar";
import Rooms from "../pages/Registrar/rooms";
import FacultyList from "../pages/Registrar/facultyList";
import Studentlist from "../pages/Registrar/studentList";
function Registrar() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SideBar />}>
                    <Route path="/department" element={<Department />} />
                    <Route path="/rooms" element={<Rooms />} />
                    <Route path="/faculty-list" element={<FacultyList />} />
                    <Route path="/student-list" element={<Studentlist />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Registrar