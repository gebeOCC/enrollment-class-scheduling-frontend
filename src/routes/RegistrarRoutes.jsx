import { BrowserRouter, Routes, Route } from "react-router-dom";
import Department from "../pages/registrar/department";
import SideBar from "../components/SideBar";
import Rooms from "../pages/Registrar/rooms";
import axios from "axios";
function Registrar() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SideBar />}>
                    <Route path="/department" element={<Department />} />
                    <Route path="/rooms" element={<Rooms />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Registrar