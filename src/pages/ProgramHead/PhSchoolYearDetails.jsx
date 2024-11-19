import { useEffect, useState } from "react"
import axiosInstance from "../../../axios/axiosInstance"
import { useParams } from "react-router-dom";
import PreLoader from "../../components/preloader/PreLoader";
import { Bar } from "react-chartjs-2";
import SchoolYearReports from "../SchoolYear/SchoolYearReports";

function PhSchoolYearDetails() {
    const { schoolYear } = useParams();
    const { semester } = useParams();
    const [reports, setReports] = useState([]);
    const [schoolYeardetails, setSchoolYearDetails] = useState([]);
    const [fetching, setfetching] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(0);
    const [enrolles, setEnrolles] = useState([]);

    useEffect(() => {
        const schoolYearDetails = async () => {
            await axiosInstance.get(`get-school-year-details/${schoolYear}/${semester}`)
                .then(response => {
                    setReports(response.data.coursesReports);
                    setSchoolYearDetails(response.data.schoolYearDetails);
                    setEnrolles(response.data.coursesReports.department.course);
                    console.log(response.data.coursesReports.department.course);
                })
                .finally(() => {
                    setfetching(false);
                })
        }
        schoolYearDetails()
    }, [])


    if (fetching) return <PreLoader />

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex justify-between flex-col sm:flex-row items-center">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-600">
                    {schoolYeardetails.start_year}-{schoolYeardetails.end_year} {schoolYeardetails.semester_name} Semester
                </h1>
                <div className="mt-2 sm:mt-0 flex sm:flex-row items-center gap-2">
                    {!!schoolYeardetails.is_current &&
                        <span className="bg-green-500 text-white text-xs font-bold rounded-full px-2 py-1 sm:mb-0">
                            Current
                        </span>
                    }

                    {!!schoolYeardetails.enrollment_ongoing && (
                        <span className="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1">Enrollment Ongoing</span>
                    )}
                    {(!schoolYeardetails.enrollment_ongoing && !!schoolYeardetails.preparation) && (
                        <span className="bg-yellow-500 text-white text-xs font-bold rounded-full px-2 py-1">Enrollment Preparing</span>
                    )}
                </div>
            </div>

            <SchoolYearReports courseData={enrolles}/>

        </div >
    )
}

export default PhSchoolYearDetails