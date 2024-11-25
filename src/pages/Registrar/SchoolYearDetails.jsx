import { useParams } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import { useEffect, useState } from "react";
import PreLoader from "../../components/preloader/PreLoader";
import { Bar } from "react-chartjs-2";
import SchoolYearReports from "../SchoolYear/SchoolYearReports";
import { FaDownload } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { utils, writeFile } from 'xlsx';

function SchoolYearDetails() {
    const { userRole } = useAuth();
    const { schoolYear } = useParams();
    const { semester } = useParams();

    const [submitting, setSubmitting] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [schoolYeardetails, setSchoolYeardetails] = useState([])

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

    const exportToExcel = (data) => {
        const dataToExport = data.map((data) => ({
            "Program Name": data.course_name_abbreviation,
            "Year Level": data.year_level_name,
            "Last Name": data.last_name,
            "First Name": data.first_name,
            "Middle Name": data.middle_name,
            "Gender": data.gender,
            "Subject Code": data.subject_code,
            "Subject": data.descriptive_title,
        }));

        const ws = utils.json_to_sheet(dataToExport); // Convert JSON to worksheet

        // Set the column widths
        const columnWidths = [
            { wch: 15 }, // Program Name.
            { wch: 10 }, // Year Level
            { wch: 15 }, // Last Name
            { wch: 15 }, // First Name
            { wch: 15 }, // Middle Name
            { wch: 10 }, // Gender
            { wch: 15 }, // Subject Code
            { wch: 30 }, // Subject
        ];

        ws['!cols'] = columnWidths; // Apply the column widths to the worksheet

        const wb = utils.book_new(); // Create a new workbook
        utils.book_append_sheet(wb, ws, "Students"); // Append the worksheet to the workbook

        const fileName = `${schoolYeardetails.start_year}-${schoolYeardetails.end_year} ${schoolYeardetails.semester_name} Semester Promotional Report.xlsx`;

        writeFile(wb, fileName); // Write the file
    };


    const downloadPromotionalReport = async () => {
        setSubmitting(true);
        await axiosInstance.get(`download-promotional-report`, {
            params: {
                id: schoolYeardetails.id,
            },
        })
            .then(response => {
                if (response.data.message == 'success') {
                    exportToExcel(response.data.promotionalReport);
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
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

            {userRole === 'registrar' && (
                <button
                    onClick={downloadPromotionalReport}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-300"
                    aria-label="Download Report"
                >
                    <FaDownload className="text-xl" />
                    <span>Promotional Report</span>
                </button>
            )}

            <SchoolYearReports courseData={reports} />
        </div>
    );
}

export default SchoolYearDetails;