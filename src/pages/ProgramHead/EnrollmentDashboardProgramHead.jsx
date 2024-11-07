import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

function EnrollmentDashboardProgramHead() {
    const [courseTotalEnrolledStudent, setCourseTotalEnrolledStudent] = useState([]);
    const [enrolles, setEnrolles] = useState([]);
    const [departmentName, setDepartmentName] = useState('');

    const getCourseEnrolledStudents = async () => {
        try {
            const response = await axiosInstance.get(`get-course-enrolled-students`);
            setEnrolles(response.data.dateEnrolled);
            setCourseTotalEnrolledStudent(response.data.totalStudents);
            setDepartmentName(response.data.department.department_name);
        } catch (error) {
            console.error("Error fetching enrollment data:", error);
        }
    };

    useEffect(() => {
        getCourseEnrolledStudents();
    }, []);

    if (!departmentName) {
        return <p>Loading...</p>;
    }

    // Prepare data for the bar chart
    const labels = enrolles.map((enroll) => enroll.date_enrolled);
    const colors = enrolles.map(() =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
    );

    const data = {
        labels,
        datasets: [
            {
                label: "Total Students",
                data: enrolles.map((enroll) => enroll.total_students),
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

    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow overflow-hidden mb-6 text-center">
                <h1 className="text-4xl font-bold text-blue-600">
                    {departmentName}
                </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courseTotalEnrolledStudent.map((total, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out text-center"
                    >
                        <h1 className="text-xl md:text-2xl font-bold text-blue-600 mb-2">
                            {total.course_name_abbreviation}
                        </h1>
                        <p className="text-gray-700 text-lg">
                            Total Students: <span className="font-semibold">{total.total_students}</span>
                        </p>
                    </div>
                ))}
            </div>

            {/* Bar Chart for Enrollment Data */}
            <div className="bg-white p-4 rounded-lg shadow mt-6">
                <Bar data={data} options={options} />
            </div>
        </>
    );
}

export default EnrollmentDashboardProgramHead;
