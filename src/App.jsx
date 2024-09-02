import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "./components/SideBar";
import LoginPage from "./pages/Guest/LoginPage";
import Department from "./pages/Registrar/Department";
import Rooms from "./pages/Registrar/Rooms";
import FacultyList from "./pages/Registrar/FacultyList";
import StudentList from "./pages/Registrar/StudentList";
import SchoolYear from "./pages/Registrar/SchoolYear";
import NotFound from "./pages/All/NotFound";
import SchoolYearDetails from "./pages/Registrar/SchoolYearDetails";
import { useAuth } from "./context/AuthContext";

function App() {
    const { userRole, fetching } = useAuth();
    console.log(userRole);

    if (fetching) {
        return <div></div>;
    }

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
                            {userRole === "registrar" ? (
                                <>
                                    <Route path="/" element={<Navigate to="/department" />} />
                                    <Route path="/department" element={<Department />} />
                                    <Route path="/rooms" element={<Rooms />} />
                                    <Route path="/faculty-list" element={<FacultyList />} />
                                    <Route path="/student-list" element={<StudentList />} />
                                    <Route path="/school-year" element={<SchoolYear />} />
                                    <Route path="/school-year/:schoolYear/:semester" element={<SchoolYearDetails />} />
                                    <Route path="*" element={<Navigate to="/department" />} />
                                </>
                            ) : (
                                <>
                                    {/* Placeholder for other roles */}
                                </>
                            )}
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
