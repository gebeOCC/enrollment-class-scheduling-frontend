import { useParams } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import { useEffect, useState } from "react";
import PreLoader from "../../components/preloader/PreLoader";
import { Bar } from "react-chartjs-2";
import SchoolYearReports from "../SchoolYear/SchoolYearReports";
function SchoolYearDetails() {
    const { schoolYear } = useParams();
    const { semester } = useParams();

    const [submitting, setSubmitting] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [schoolYeardetails, setSchoolYeardetails] = useState([])
    const [selectedCourse, setSelectedCourse] = useState(0);

    const [reports, setReports] = useState([]);

    const getSChoolYearDetails = async () => {
        axiosInstance.get(`get-school-year-details/${schoolYear}/${semester}`)
            .then(response => {
                if (response.data.message === "success") {
                    setSchoolYeardetails(response.data.schoolYearDetails)
                    setReports(response.data.coursesReports)
                    console.log(response.data.coursesReports)
                    setFetching(false);
                }
                console.log(response.data)
            })
    }
    useEffect(() => {
        getSChoolYearDetails();
    }, [])

    if (fetching) {
        return <PreLoader />;
    }

    if (!schoolYeardetails) {
        return (
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center items-center">
                    <h1 className="text-4xl font-bold text-blue-600">
                        {schoolYear} {semester} Semester{" "}
                    </h1>
                    <h2 className="text-red-600 text-3xl"> didn’t exist!</h2>
                </div>
            </div>
        )
    }

    const setAsDefault = async () => {
        setSubmitting(true);
        await axiosInstance.post(`set-sy-default/${schoolYeardetails.id}`)
            .then(response => {
                if (response.data.message === 'success') {
                    getSChoolYearDetails();
                }
            })
            .finally(() => {
                setSubmitting(false);
            })
    }

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex flex-col sm:flex-row justify-between items-center">
                <h1 className="text-2xl sm:text-4xl font-bold text-blue-600">
                    {schoolYeardetails.start_year}-{schoolYeardetails.end_year} {schoolYeardetails.semester_name} Semester
                </h1>
                <div className="mt-2 sm:mt-0 flex sm:flex-row items-center gap-2">
                    {schoolYeardetails.is_current ? (
                        <span className="bg-green-500 text-white text-xs font-bold rounded-full px-2 py-1 sm:mb-0">
                            Current
                        </span>
                    ) : (
                        <button
                            disabled={submitting}
                            onClick={setAsDefault}
                            className="bg-green-300 text-black text-xs font-bold rounded-full px-2 py-1 transition-transform duration-300 ease-in-out transform shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                            Set as Current
                        </button>
                    )}

                    {!!schoolYeardetails.enrollment_ongoing && (
                        <span className="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1">Enrollment Ongoing</span>
                    )}
                    {(!schoolYeardetails.enrollment_ongoing && !!schoolYeardetails.preparation) && (
                        <span className="bg-yellow-500 text-white text-xs font-bold rounded-full px-2 py-1">Enrollment Preparing</span>
                    )}
                </div>
            </div>

            <SchoolYearReports courseData={reports} />
        </div>
    );
}

export default SchoolYearDetails;