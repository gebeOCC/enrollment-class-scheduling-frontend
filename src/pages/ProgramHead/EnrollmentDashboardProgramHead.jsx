import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";

function EnrollmentDashboardProgramHead() {
    const [courseTotalEnrolledStudent, setCourseTotalEnrolledStudent] = useState([]);
    const [enrolles, setEnrolles] = useState([]);
    const [departmentName, setDepartmentName] = useState('');

    const getCourseEnrolledStudents = async () => {
        axiosInstance.get(`get-course-enrolled-students`)
            .then(response => {
                setEnrolles(response.data.dateEnrolled);
                setCourseTotalEnrolledStudent(response.data.totalStudents)
                setDepartmentName(response.data.department.department_name)
                console.log(response.data.dateEnrolled);
            })
    }

    useEffect(() => {
        getCourseEnrolledStudents();
    }, [])

    if (!departmentName) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow overflow-hidden mb-6 text-center">
                <>
                    <h1 className="text-4xl font-bold text-blue-600">
                        {departmentName}
                    </h1>
                </>
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
            {enrolles.map((enroll, index) => (
                <p key={index}>{enroll.course_name_abbreviation} {enroll.date_enrolled} - {enroll.total_students}</p>
            ))}
        </>
    )
}

export default EnrollmentDashboardProgramHead;