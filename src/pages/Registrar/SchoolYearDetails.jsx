import { useParams } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import { useEffect, useState } from "react";
import PreLoader from "../../components/preloader/PreLoader";
import { Bar } from "react-chartjs-2";
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

    const yearSection = selectedCourse === 0
        ? reports
            .flatMap(enrollee => enrollee.year_section)  // Flatten all year_section objects
            .reduce((acc, current) => {
                // Find if there is already an entry for the same date_enrolled in the accumulator
                const existing = acc.find(item => item.date_enrolled === current.date_enrolled);

                if (existing) {
                    // If found, combine total_students (sum them up) for the same date_enrolled
                    existing.total_students += current.total_students;
                } else {
                    // Otherwise, add the new entry to the accumulator
                    acc.push({ ...current });
                }

                return acc;
            }, [])  // Initialize accumulator as an empty array
            .sort((a, b) => new Date(a.date_enrolled) - new Date(b.date_enrolled))  // Sort in ascending order by date_enrolled
        : reports.find(enrollee => enrollee.id === selectedCourse)?.year_section?.sort((a, b) => new Date(a.date_enrolled) - new Date(b.date_enrolled)) || [];


    const labels = yearSection.map((enroll) => enroll.date_enrolled);

    const colors = yearSection.map(() =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
    );

    const data = {
        labels,
        datasets: [
            {
                label: "Total Students",
                data: yearSection.map((enroll) => enroll.total_students),
                backgroundColor: colors,
            },
        ],
    };


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Enrollment Over Time",
            },
            datalabels: {
                anchor: "center",  // Place the label in the center of the bar
                align: "center",   // Align the text within the center
                formatter: (value) => value, // Display the actual value
                color: "#fff",     // White color for the text to stand out
                font: {
                    weight: "bold",
                    size: 14,   // Adjust size for readability
                },
            },
        },
    };

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

            <div className="p-4 bg-white rounded-lg shadow-lg w-full flex gap-4 sm:gap-0 sm:flex-col items-center sm:items-start justify-center sm:w-min sm:space-y-4">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">Course:</h1>
                {/* Select dropdown for mobile screens */}
                <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(Number(e.target.value))}
                    className={`sm:hidden h-full border-2 border-gray-300 focus:ring-blue-500 w-full p-2 rounded-sm text-md font-semibold transition-all duration-300 
                    text-gray-700 bg-white focus:outline-none focus:ring-2`}
                >
                    <option value="0">All</option>
                    {reports.map((course, index) => (
                        <option key={index} value={course.id}>
                            {course.course_name_abbreviation}
                        </option>
                    ))}
                </select>

                {/* Buttons for desktop screens */}
                <div className="hidden sm:block w-full">
                    <div className="flex w-full items-center gap-4">
                        <button
                            onClick={() => setSelectedCourse(0)}
                            className={`border w-36 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 
                    ${selectedCourse == 0 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                        >
                            All
                        </button>
                        {reports.map((course, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedCourse(course.id)}
                                className={`border w-36 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 
                        ${selectedCourse == course.id ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                            >
                                {course.course_name_abbreviation}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reports */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {/* Total Enrolled Students */}
                <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-6 rounded-lg text-white shadow-light">
                    <h2 className="text-2xl font-semibold mb-4">Total Enrolled</h2>
                    <div className="flex justify-between items-center">
                        <span className="text-3xl font-bold">
                            {reports
                                .filter((report) => selectedCourse === 0 || report.id === selectedCourse)
                                .reduce((total, report) => total + report.enrolled_student_count, 0)}
                        </span>
                    </div>
                </div>

                {/* Student Types */}
                <div className="bg-blue-500 p-6 rounded-lg text-white shadow-light">
                    <h2 className="text-2xl font-bold mb-4">Student Types</h2>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="border-b border-white/50">
                                <th className="py-3 text-left">Type</th>
                                <th className="py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-white/30 hover:bg-white/10">
                                <td className="py-2 text-left flex items-center gap-2">
                                    <span className="inline-block w-2 h-3 bg-yellow-500 rounded-full"></span>
                                    Freshman
                                </td>
                                <td className="py-2 text-right">
                                    {reports
                                        .filter((report) => selectedCourse === 0 || report.id === selectedCourse)
                                        .reduce((acc, report) => acc + report.freshman_count, 0)}
                                </td>
                            </tr>
                            <tr className="border-b border-white/30 hover:bg-white/10">
                                <td className="py-2 text-left flex items-center gap-2">
                                    <span className="inline-block w-2 h-3 bg-purple-500 rounded-full"></span>
                                    Old
                                </td>
                                <td className="py-2 text-right">
                                    {reports
                                        .filter((report) => selectedCourse === 0 || report.id === selectedCourse)
                                        .reduce((acc, report) => acc + report.old_count, 0)}
                                </td>
                            </tr>
                            <tr className="border-b border-white/30 hover:bg-white/10">
                                <td className="py-2 text-left flex items-center gap-2">
                                    <span className="inline-block w-2 h-3 bg-teal-500 rounded-full"></span>
                                    Returnee
                                </td>
                                <td className="py-2 text-right">
                                    {reports
                                        .filter((report) => selectedCourse === 0 || report.id === selectedCourse)
                                        .reduce((acc, report) => acc + report.returnee_count, 0)}
                                </td>
                            </tr>
                            <tr className="hover:bg-white/10">
                                <td className="py-2 text-left flex items-center gap-2">
                                    <span className="inline-block w-2 h-3 bg-pink-500 rounded-full"></span>
                                    Transferee
                                </td>
                                <td className="py-2 text-right">
                                    {reports
                                        .filter((report) => selectedCourse === 0 || report.id === selectedCourse)
                                        .reduce((acc, report) => acc + report.transferee_count, 0)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="space-y-4 shadow-light">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4"> Gender Statistics</h2>

                        {/* 1st Year */}
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-700">1st Year</h3>
                            <div className="flex gap-4">
                                <span className="text-sm text-blue-600 font-medium">
                                    Male:
                                    {reports
                                        .filter(report => selectedCourse === 0 || report.id === selectedCourse)
                                        .reduce((acc, report) => acc + report.first_year_male_count, 0)}
                                </span>
                                <span className="text-sm text-pink-600 font-medium">
                                    Female:
                                    {reports
                                        .filter(report => selectedCourse === 0 || report.id === selectedCourse)
                                        .reduce((acc, report) => acc + report.first_year_female_count, 0)}
                                </span>
                            </div>
                        </div>

                        {/* 2nd Year */}
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-700">2nd Year</h3>
                            <div className="flex gap-4">
                                <span className="text-sm text-blue-600 font-medium">
                                    Male:
                                    {reports
                                        .filter(report => selectedCourse === 0 || report.id === selectedCourse)
                                        .reduce((acc, report) => acc + report.second_year_male_count, 0)}
                                </span>
                                <span className="text-sm text-pink-600 font-medium">
                                    Female:
                                    {reports
                                        .filter(report => selectedCourse === 0 || report.id === selectedCourse)
                                        .reduce((acc, report) => acc + report.second_year_female_count, 0)}
                                </span>
                            </div>
                        </div>

                        {/* 3rd Year */}
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-700">3rd Year</h3>
                            <div className="flex gap-4">
                                <span className="text-sm text-blue-600 font-medium">
                                    Male:
                                    {reports
                                        .filter(report => selectedCourse === 0 || report.id === selectedCourse)
                                        .reduce((acc, report) => acc + report.third_year_male_count, 0)}
                                </span>
                                <span className="text-sm text-pink-600 font-medium">
                                    Female:
                                    {reports
                                        .filter(report => selectedCourse === 0 || report.id === selectedCourse)
                                        .reduce((acc, report) => acc + report.third_year_female_count, 0)}
                                </span>
                            </div>
                        </div>

                        {/* 4th Year */}
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-700">4th Year</h3>
                            <div className="flex gap-4">
                                <span className="text-sm text-blue-600 font-medium">
                                    Male:
                                    {reports
                                        .filter(report => selectedCourse === 0 || report.id === selectedCourse)
                                        .reduce((acc, report) => acc + report.fourth_year_male_count, 0)}
                                </span>
                                <span className="text-sm text-pink-600 font-medium">
                                    Female:
                                    {reports
                                        .filter(report => selectedCourse === 0 || report.id === selectedCourse)
                                        .reduce((acc, report) => acc + report.fourth_year_female_count, 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-light col-span-3 row-span-3">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}

export default SchoolYearDetails;