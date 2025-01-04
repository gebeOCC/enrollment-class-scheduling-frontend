import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import SkeletonEnrollmentCourse from "../../components/skeletons/SkeletonEnrollmentCourse";
import { ImSpinner5 } from "react-icons/im";
function EnrollmentCourse() {
    const { userRole, enrollmentOngoing } = useAuth();
    const { courseid } = useParams();
    const [course, setCourse] = useState([]);

    const [yearLevels, setYearLevels] = useState([]);

    const [noMaxStudent, setNoMaxStudent] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [yearSectionForm, setYearSectionForm] = useState({
        course_id: courseid,
        year_level_id: 0,
        section: "",
        max_students: 0
    })

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const getCourseName = async () => {
            await axiosInstance.get(`get-course-name/${courseid}`)
                .then(response => {
                    setCourse(response.data);
                });
        };

        const getYearLevels = async () => {
            await axiosInstance.get(`enrollment/${courseid}`)
                .then(response => {
                    setYearLevels(response.data);
                    console.log(response.data);
                })
                .finally(() => {
                    setFetching(false);
                });
        };

        setFetching(true);
        getYearLevels();
        getCourseName()
    }, [courseid]);

    const submitNewSection = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        console.log(yearSectionForm.max_students);

        if (!yearSectionForm.max_students || yearSectionForm.max_students <= 0) {
            setNoMaxStudent(true);
            setSubmitting(false);
            return;
        } else {
            setNoMaxStudent(false);
        }

        axiosInstance.post(`add-new-section/${courseid}`, yearSectionForm)
            .then(response => {
                if (response.data.message === 'success') {
                    setYearSectionForm(prev => ({
                        ...prev,
                        year_level_id: 0,
                        section: '',
                        max_students: '',
                    }));
                    setYearLevels(response.data.yearLevels);
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const createNewSection = (year_level_id) => {
        setYearSectionForm(prev => ({
            ...prev,
            year_level_id: year_level_id
        }));

        yearLevels.some((yearLevel) => {
            if (yearLevel.id == year_level_id) {
                const yearSection = yearLevel.year_section.length;

                const sectionLetter = String.fromCharCode(65 + yearSection);

                setYearSectionForm(prev => ({
                    ...prev,
                    section: sectionLetter
                }));
                console.log(sectionLetter)
                return true;
            }
        });
    };

    if (fetching) return <SkeletonEnrollmentCourse />;

    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow-light overflow-hidden mb-6 text-center">
                <h1 className="text-2xl md:text-4xl font-bold text-blue-600 flex justify-center items-center content-center">
                    {course.course_name}
                </h1>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {yearLevels.map((yearLevel, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-light transition-shadow duration-300 overflow-hidden">
                        <div className="mb-4 flex justify-between items-center">
                            <h2 className="text-2xl font-semibold text-gray-800">{yearLevel.year_level_name}</h2>
                            {userRole != 'registrar' &&
                                <button
                                    onClick={() => { createNewSection(yearLevel.id) }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                                    Add Section
                                </button>
                            }
                        </div>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-blue-700 text-white text-left">
                                    <th className="p-2">Section</th>
                                    <th className="p-2">Students</th>
                                    <th className="p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {yearLevel.year_section && yearLevel.year_section.map((section, index) => (
                                    <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"}`}>
                                        <td className="p-2 text-gray-700">{section.section}</td>
                                        <td className="p-2 text-gray-700">{section.student_count}/{section.max_students}</td>
                                        <td className="p-2 space-x-1 flex items-center">
                                            {userRole === 'program_head' &&
                                                <Link to={`class/${yearLevel.year_level_name.replace(/\s+/g, '-')}?section=${section.section}`}>
                                                    <button className="hidden sm:flex text-white bg-indigo-500 px-2 py-1 rounded hover:bg-indigo-600 hover:shadow-md transition-50 active:bg-blue-600">
                                                        Class
                                                    </button>
                                                </Link>
                                            }
                                            <Link to={`students/${yearLevel.year_level_name.replace(/\s+/g, '-')}?section=${section.section}`}>
                                                <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 hover:shadow-md transition-all transition-150 active:bg-emerald-500">
                                                    Students
                                                </button>
                                            </Link>
                                            {enrollmentOngoing ? (
                                                <Link to={`enroll-student/${yearLevel.year_level_name.replace(/\s+/g, '-')}?section=${section.section}`}>
                                                    <button className="hidden sm:flex items-center bg-purple-600 text-white px-2 py-1 rounded-lg transition-transform transform hover:scale-105 hover:shadow-md active:scale-95">
                                                        Enroll Student
                                                    </button>
                                                </Link>
                                            ) : (
                                                <button className="hidden sm:flex items-center bg-gray-400 text-white px-2 py-1 rounded-lg cursor-not-allowed">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                                    </svg>
                                                    Enroll Student
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>


            {yearSectionForm.year_level_id != 0 &&
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md w-1/4">
                        <form action="">
                            <h2 className="text-3xl font-bold text-center mb-6">Add  Section?</h2>
                            <label htmlFor="faculty-search" className="block text-gray-700 font-medium mb-2">
                                Section:
                            </label>
                            <input
                                readOnly={true}
                                value={yearSectionForm.section}
                                className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent" />
                            <label htmlFor="faculty-search" className="block text-gray-700 font-medium mb-2">
                                Maximum Students:
                            </label>
                            <input
                                value={yearSectionForm.max_students}
                                name="max_students"
                                onChange={(e) => {
                                    setYearSectionForm(prev => ({
                                        ...prev,
                                        max_students: e.target.value
                                    }))
                                }}
                                type="number"
                                className={`mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent ${noMaxStudent && 'border-red-300'}`} />
                            <button
                                disabled={submitting}
                                type="submit"
                                onClick={submitNewSection}
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mb-2">
                                Yes
                                {submitting && <ImSpinner5 className="inline-block animate-spin ml-1" />}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setYearSectionForm(prev => ({
                                        ...prev,
                                        year_level_id: 0
                                    }))
                                }}
                                className="w-full border border-thirdColor text-thirdColor py-2 rounded-md hover:bg-thirdColor hover:text-white">
                                No
                            </button>
                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default EnrollmentCourse