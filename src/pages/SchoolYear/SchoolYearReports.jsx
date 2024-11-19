import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { PiStudentFill } from "react-icons/pi";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

function SchoolYearReports({ courseData }) {

    const [selectedCourse, setSelectedCourse] = useState(0);

    const yearSection = selectedCourse === 0
        ? courseData
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
        : courseData.find(enrollee => enrollee.id === selectedCourse)?.year_section?.sort((a, b) => new Date(a.date_enrolled) - new Date(b.date_enrolled)) || [];


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
                anchor: "center",
                align: "center",
                formatter: (value) => value,
                color: "#fff",
                font: {
                    weight: "bold",
                    size: 20,
                },
            },
        },
    };
    return (
        <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow-light w-full flex gap-4 sm:gap-0 sm:flex-col items-center sm:items-start justify-center sm:w-min sm:space-y-4">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">Course:</h1>
                {/* Select dropdown for mobile screens */}
                <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(Number(e.target.value))}
                    className={`sm:hidden h-full border-2 border-gray-300 focus:ring-blue-500 w-full p-2 rounded-sm text-md font-semibold transition-all duration-300 
                    text-gray-700 bg-white focus:outline-none focus:ring-2`}
                >
                    <option value="0">All</option>
                    {courseData.map((course, index) => (
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
                        {courseData.map((course, index) => (
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
                <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-6 rounded-xl text-white shadow-lg h-min">
                    <h2 className="text-2xl font-semibold mb-4 border-b border-white/50 pb-2">
                        Total Enrolled
                    </h2>
                    <div className="flex justify-between items-center">
                        <span className="text-4xl font-extrabold flex items-center gap-3">
                            <PiStudentFill className="text-white/80 text-5xl" />
                            {courseData
                                .filter(
                                    (report) =>
                                        selectedCourse === 0 || report.id === selectedCourse
                                )
                                .reduce((total, report) => total + report.enrolled_student_count, 0)}
                        </span>
                    </div>
                </div>


                {/* Student Types */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl text-white shadow-lg row-span-2">
                    <h2 className="text-2xl font-bold mb-4 border-b border-white/50 pb-2">
                        Student Types
                    </h2>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="border-b border-white/40 text-left">
                                <th className="pb-2 px-2">Type</th>
                                <th className="pb-2 px-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { label: "Freshman", color: "bg-yellow-500", count: "freshman_count" },
                                { label: "Old", color: "bg-purple-500", count: "old_count" },
                                { label: "Returnee", color: "bg-teal-500", count: "returnee_count" },
                                { label: "Transferee", color: "bg-pink-500", count: "transferee_count" },
                            ].map((type, index) => (
                                <tr
                                    key={index}
                                    className={`border-b border-white/30 hover:bg-white/10 ${index === 3 ? "border-none" : ""
                                        }`}
                                >
                                    <td className="p-2 text-left flex items-center gap-3">
                                        <span
                                            className={`inline-block w-3 h-3 ${type.color} rounded-full`}
                                        ></span>
                                        {type.label}
                                    </td>
                                    <td className="p-2 text-right">
                                        {courseData
                                            .filter(
                                                (report) =>
                                                    selectedCourse === 0 || report.id === selectedCourse
                                            )
                                            .reduce((acc, report) => acc + report[type.count], 0)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 row-span-2">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-black pb-2">
                        Gender Statistics
                    </h2>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className=" text-gray-700">
                                <th className="px-2 pb-2 font-semibold text-start">Year</th>
                                <th className="px-2 pb-2 font-semibold text-center">Male</th>
                                <th className="px-2 pb-2 font-semibold text-center">Female</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { year: "1st", male: "first_year_male_count", female: "first_year_female_count" },
                                { year: "2nd", male: "second_year_male_count", female: "second_year_female_count" },
                                { year: "3rd", male: "third_year_male_count", female: "third_year_female_count" },
                                { year: "4th", male: "fourth_year_male_count", female: "fourth_year_female_count" },
                            ].map((data, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        } hover:bg-gray-100 transition-colors`}
                                >
                                    <td className="p-2 text-gray-700 font-medium">{data.year}</td>
                                    <td className="p-2 text-center text-sm font-medium text-blue-600">
                                        {courseData
                                            .filter(report => selectedCourse === 0 || report.id === selectedCourse)
                                            .reduce((acc, report) => acc + report[data.male], 0)}
                                    </td>
                                    <td className="p-2 text-center text-sm font-medium text-pink-600">
                                        {courseData
                                            .filter(report => selectedCourse === 0 || report.id === selectedCourse)
                                            .reduce((acc, report) => acc + report[data.female], 0)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>



            </div>
            <div className="bg-white p-4 rounded-lg shadow-light col-span-3 row-span-3">
                <Bar data={data} options={options} />
            </div>
        </div>
    )
}

export default SchoolYearReports