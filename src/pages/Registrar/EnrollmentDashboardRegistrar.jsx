import { useEffect, useState } from "react";
import PreLoader from "../../components/preloader/PreLoader";
import axiosInstance from "../../../axios/axiosInstance";
import SchoolYearReports from "../SchoolYear/SchoolYearReports";

function EnrollmentDashboardRegistrar() {
    const [fetching, setFetching] = useState(true);
    const [reports, setReports] = useState([]);
    const [schoolYearDetails, setSchoolYearDetails] = useState([]);

    const getCourseEnrolledStudents = async () => {
        await axiosInstance.get(`get-enrollment-dashboard-data`)
            .then(response => {
                setReports(response.data.coursesReports);
                setSchoolYearDetails(response.data.schoolYearDetails);
            })
            .finally(() => {
                setFetching(false);
            });
    };

    useEffect(() => {
        getCourseEnrolledStudents();
    }, []);

    if (fetching) return <PreLoader />

    return (
        <div className="space-y-4">
            <h1 className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex flex-col sm:flex-row justify-center items-center text-2xl sm:text-4xl font-bold text-blue-600">
                {schoolYearDetails.start_year}-{schoolYearDetails.end_year} {schoolYearDetails.semester.semester_name} Semester
            </h1>
            <SchoolYearReports courseData={reports} />
        </div>
    )
}

export default EnrollmentDashboardRegistrar;