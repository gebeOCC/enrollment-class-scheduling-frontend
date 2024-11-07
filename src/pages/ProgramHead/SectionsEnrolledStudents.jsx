import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { useLocation, useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { capitalizeFirstLetter, getFirstLetter } from "../../utilities/utils";

function EnrollStudent() {
    const { courseid, yearlevel } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get('section');
    const [courseName, setCourseName] = useState([]);
    const [students, setStudents] = useState([]);
    const [searchBar, setSearchBar] = useState("");
    const [showCount, setShowCount] = useState(10);

    useEffect(() => {
        const getCourseName = async () => {
            await axiosInstance.get(`get-course-name/${courseid}`)
                .then(response => {
                    setCourseName(response.data);
                });
        };

        const getYearLevelSectionSectionStudents = async () => {
            const yearLevelNumber =
                yearlevel === 'First-Year' ? '1' :
                    yearlevel === 'Second-Year' ? '2' :
                        yearlevel === 'Third-Year' ? '3' :
                            yearlevel === 'Fourth-Year' ? '4' : '';

            await axiosInstance.get(`get-year-level-section-section-students/${courseid}/${yearLevelNumber}/${section}`)
                .then(response => {
                    if (response.data.message === 'success') {
                        setStudents(response.data.students);
                    }
                });
        };

        getCourseName();
        getYearLevelSectionSectionStudents();
    }, [courseid, yearlevel, section]);

    return (
        <div className="space-y-4">
            {courseName.course_name_abbreviation && (
                <div className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex justify-center items-center">
                    <h1 className="text-4xl font-bold text-blue-600">
                        {courseName.course_name_abbreviation} -{' '}
                        {
                            { 'First-Year': '1', 'Second-Year': '2', 'Third-Year': '3', 'Fourth-Year': '4' }[yearlevel] || ''
                        }
                        {section}
                    </h1>
                </div>
            )}

            <table className="min-w-full bg-white">
                <thead>
                    <tr className="w-full bg-[#00b6cf] text-white text-left">
                        <th className="py-2 px-4">Student ID no.</th>
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Email</th>
                        <th className="py-2 px-4">Contact no.</th>
                        <th className="py-2 px-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students
                            .filter((student) => (
                                searchBar === "" ||
                                student.user.user_id_no.toLowerCase().includes(searchBar.toLowerCase()) ||
                                (`${student.user.user_information.last_name}${student.user.user_information.first_name}${getFirstLetter(student.user.user_information.middle_name)}`)
                                    .toLowerCase().includes(searchBar.toLowerCase())
                            ))
                            .slice(0, showCount)
                            .map((student, index) => (
                                <tr
                                    key={index}
                                    className="border-b hover:bg-[#deeced] cursor-pointer"
                                >
                                    <td className="py-2 px-4 transition duration-200 hover:py-3">{student.user.user_id_no}</td>
                                    <td className="py-2 px-4 transition duration-200 hover:py-3">
                                        {capitalizeFirstLetter(student.user.user_information.last_name)}, {capitalizeFirstLetter(student.user.user_information.first_name)}{" "}
                                        {student.user.user_information.middle_name && getFirstLetter(student.user.user_information.middle_name) + '.'}
                                    </td>
                                    <td className="py-2 px-4 transition duration-200 hover:py-3">{student.user.user_information.email_address}</td>
                                    <td className="py-2 px-4 transition duration-200 hover:py-3">{student.user.user_information.contact_number}</td>
                                    <Link to={`${section}/cor?student-id=${student.user.user_id_no}`}>
                                        <td className="py-2 px-4 transition duration-200 hover:py-3">
                                            <button className="bg-blue-500 text-white py-1 px-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200">
                                                COR
                                            </button>
                                        </td>
                                    </Link>
                                </tr>
                            ))
                    ) : (
                        <tr>
                            <td className="py-2 px-4" colSpan="4">
                                No Data
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default EnrollStudent;
