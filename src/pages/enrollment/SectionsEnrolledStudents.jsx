import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { useLocation, useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { capitalizeFirstLetter, formatFullName, getFirstLetter } from "../../utilities/utils";
import PreLoader from "../../components/preloader/PreLoader";
import { useAuth } from "../../context/AuthContext";
import { MdOutlineDriveFileMove } from "react-icons/md";
import Toast, { showToast } from "../../components/Toast";

function SectionsEnrolledStudents() {
    const { courseid, yearlevel } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get('section');
    const [courseName, setCourseName] = useState([]);
    const [students, setStudents] = useState([]);
    const [searchBar, setSearchBar] = useState("");
    const [fetching, setFetching] = useState(true);
    const [enrolledStudentId, setEnrolledStudentId] = useState(0);
    const [sections, setSections] = useState([]);
    const [gettingSections, setGettingSections] = useState(true);
    const { userRole } = useAuth();
    const [submitting, setSubmitting] = useState(false);

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
            })
            .finally(() => {
                setFetching(false);
            });
    };

    useEffect(() => {
        const getCourseName = async () => {
            await axiosInstance.get(`get-course-name/${courseid}`)
                .then(response => {
                    setCourseName(response.data);
                });
        };

        getCourseName();
        getYearLevelSectionSectionStudents();
    }, [courseid, yearlevel, section]);

    const getSections = async () => {
        if (sections.length > 0) return

        await axiosInstance.get(`enrollment/${courseid}`)
            .then(response => {
                setSections(response.data);
            })
            .finally(() => {
                setGettingSections(false);
            });
    }

    const moveStudent = async (id) => {
        setSubmitting(true)
        await axiosInstance.post('move-student-year-section', {
            student_id: enrolledStudentId,
            year_section_id: id,
        })
            .then(response => {
                if ((response.data.message == 'success')) {
                    getYearLevelSectionSectionStudents();
                    setEnrolledStudentId(0);
                    showToast('Student moved!', 'success');
                }
            }).finally(() => {
                setSubmitting(false)
            })
    }

    if (fetching) return <PreLoader />

    return (
        <>
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
                            <th className="text-center">#</th>
                            <th className="hidden sm:table-cell py-2 px-4">Student ID no.</th>
                            <th className="py-2 px-4">Name</th>
                            <th className="hidden sm:table-cell py-2 px-4">Email</th>
                            {/* <th className="py-2 px-4"> Contact no.</th> */}
                            <th className="hidden sm:table-cell py-2 px-4"></th>
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
                                .map((student, index) => (
                                    <tr
                                        key={index}
                                        className="border-b hover:bg-[#deeced]"
                                    >
                                        <td className="text-center">{index + 1}.</td>
                                        <td className="hidden sm:table-cell transition duration-200">{student.user.user_id_no}</td>
                                        <td className="py-2 px-4 transition duration-200">
                                            {capitalizeFirstLetter(student.user.user_information.last_name)}, {capitalizeFirstLetter(student.user.user_information.first_name)}{" "}
                                            {student.user.user_information.middle_name && getFirstLetter(student.user.user_information.middle_name) + '.'}
                                        </td>
                                        <td className="hidden sm:table-cell transition duration-200">{student.user.user_information.email_address}</td>
                                        {/* <td className="py-2 px-4 transition duration-200">{student.user.user_information.contact_number}</td> */}
                                        <td className="hidden sm:table-cell transition duration-200 space-x-2 items-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <Link to={`${section}/subjects/student?student-id=${student.user.user_id_no}`}>
                                                    <button className="bg-green-500 text-white py-1 px-3 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200">
                                                        Subject
                                                    </button>
                                                </Link>

                                                <Link to={`${section}/cor?student-id=${student.user.user_id_no}`}>
                                                    <button className="bg-blue-500 text-white py-1 px-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200">
                                                        COR
                                                    </button>
                                                </Link>

                                                {userRole == 'program_head' &&
                                                    <button
                                                        onClick={() => {
                                                            setEnrolledStudentId(student.id)
                                                            getSections()
                                                        }}
                                                        className="self-center">
                                                        <MdOutlineDriveFileMove size={40} className="text-blue-500 cursor-pointer" />
                                                    </button>
                                                }
                                            </div>
                                        </td>
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
            {!!enrolledStudentId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
                        {
                            (() => {
                                const student = students.find((student) => student.id === enrolledStudentId);

                                return student?.user?.user_information?.last_name ? (
                                    <h1 className="font-semibold text-xl border-b border-gray-600">
                                        {formatFullName(student.user.user_information)}
                                    </h1>
                                ) : null;
                            })()
                        }
                        <div className="h-72 overflow-auto my-4">
                            {gettingSections ? (
                                <>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    {sections.map((section, index) => (
                                        <div key={index}>
                                            {section.year_section && section.year_section.map((section, index) => (
                                                <div
                                                    key={index}
                                                    className="border-b flex justify-between items-center px-2 hover:bg-gray-200 group"
                                                >
                                                    <div className="p-2">
                                                        {section.year_level_id}
                                                        {section.section}
                                                    </div>
                                                    <button
                                                        disabled={submitting}
                                                        onClick={() => moveStudent(section.id)}
                                                        className="bg-white rounded-lg text-blue-700 h-max text-md px-2 hover:bg-blue-100 hidden group-hover:block">
                                                        Move
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </>
                            )
                            }
                        </div>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="bg-gray-300 text-gray-700 w-full py-2 rounded-md font-medium hover:bg-gray-400 focus:outline-none transition transform duration-200"
                                onClick={() => setEnrolledStudentId(0)}
                                aria-label="Cancel action"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Toast />
        </>
    );
}

export default SectionsEnrolledStudents;
