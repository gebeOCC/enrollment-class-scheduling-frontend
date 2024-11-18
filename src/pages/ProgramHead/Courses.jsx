import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { Link } from "react-router-dom";
import PreLoader from "../../components/preloader/PreLoader";
function Courses() {
    const [courses, setCourses] = useState([])
    const [fetching, setFetching] = useState(true);

    const getCourses = async () => {
        await axiosInstance.get(`get-department-courses`)
            .then(response => {
                setCourses(response.data)
            })
            .finally(() => {
                setFetching(false);
            })
    }

    useEffect(() => {
        getCourses()
    }, [])

    if (fetching) return <PreLoader />

    return (
        <>
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
        </>
    );
}

export default Courses;
