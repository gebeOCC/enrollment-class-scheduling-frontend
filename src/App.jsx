import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import SideBar from "./components/SideBar";
import LoginPage from "./pages/Guest/LoginPage";
import Department from "./pages/registrar/department";
import Rooms from "./pages/Registrar/rooms";
import FacultyList from "./pages/Registrar/facultyList";
import Studentlist from "./pages/Registrar/studentList";
import SchoolYear from "./pages/Registrar/schoolYear";
import NotFound from "./pages/All/NotFound";
import SchoolYearDetails from "./pages/Registrar/SchoolYearDetails";

function App() {
    const [userRole, setUserRole] = useState('faculty')
    const [facultyRole, setFacultyRole] = useState('registrar')

    return (
        <BrowserRouter>
            <Routes>
                {!userRole ?
                    (
                        <>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </>
                    )
                    :
                    (
                        <>
                            <Route path="/" element={<SideBar />}>
                                {userRole == "faculty" ?
                                    (
                                        <>
                                            {facultyRole == "registrar" ?
                                                (
                                                    <>
                                                        <Route path="/" element={<Navigate to="/department" />} />
                                                        <Route path="/department" element={<Department />} />
                                                        <Route path="/rooms" element={<Rooms />} />
                                                        <Route path="/faculty-list" element={<FacultyList />} />
                                                        <Route path="/student-list" element={<Studentlist />} />
                                                        <Route path="/school-year" element={<SchoolYear />} />
                                                        <Route path="/school-year/:schoolYear/:semester" element={<SchoolYearDetails />} />
                                                    </>
                                                )
                                                :
                                                (
                                                    <>

                                                    </>
                                                )
                                            }
                                        </>
                                    )
                                    :
                                    (
                                        <>

                                        </>
                                    )
                                }
                            </Route>
                            <Route path="*" element={<NotFound />} />
                        </>
                    )
                }
            </Routes>
        </BrowserRouter>
    );
}

export default App;
