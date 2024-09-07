import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { Link } from "react-router-dom";
function Courses() {
    const [courses, setCourses] = useState([])

    useEffect(() => {
        const getCourses = async () => {
            await axiosInstance.get(`get-department-courses`)
                .then(response => {
                    setCourses(response.data)
                })
        }
        getCourses()
    }, [])

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-secondaryColor mb-4">Courses</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {courses.map((course, index) => (
                    <Link key={index} to={`${course.hashed_course_id}`}>
                        <div key={course.id} className="bg-white shadow-lg p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-primaryColor">
                                {course.course_name}
                            </h2>
                            <p className="text-gray-500">{course.course_name_abbreviation}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Courses;
