import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { lazy, Suspense } from "react";

const SideBar = lazy(() => import("./components/SideBar"));
const LoginPage = lazy(() => import("./pages/Guest/LoginPage"));
const NotFound = lazy(() => import("./pages/All/NotFound"));
const Profile = lazy(() => import("./pages/All/Profile"));

import RegistrarRoutes from "./routes/RegistrarRoutes";
import ProgramHeadRoutes from "./routes/ProgramHeadRoutes";
import EvaluatorRoutes from "./routes/EvaluatorRoutes";
import FacultyRoutes from "./routes/FacultyRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import WebsiteLoading from "./components/WebsiteLoading/WebsiteLoading";

function App() {
    const { userRole, enrollmentOngoing, preparation } = useAuth();

    const renderRoutesByRole = () => {
        switch (userRole) {
            case "registrar":
                return RegistrarRoutes({ enrollmentOngoing, preparation });
            case "program_head":
                return ProgramHeadRoutes({ enrollmentOngoing, preparation });
            case "evaluator":
                return EvaluatorRoutes({ enrollmentOngoing, preparation });
            case "faculty":
                return FacultyRoutes();
            case "student":
                return StudentRoutes();
            default:
                return <Route path="*" element={<Navigate to="/login" />} />;
        }
    };
    
    return (
        <BrowserRouter>
            <Suspense fallback={< WebsiteLoading />}>
                <Routes>
                    {!userRole ? (
                        <>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </>
                    ) : (
                        <>
                            <Route path="/" element={<SideBar />}>
                                <Route path="/profile" element={<Profile />} />
                                {renderRoutesByRole()}
                            </Route>
                            <Route path="*" element={<NotFound />} />
                        </>
                    )}
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
