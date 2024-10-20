import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { useAuth } from "../../context/AuthContext";
function EnrollmentCourse() {
    const { enrollmentOngoing, preparation } = useAuth();
    const { courseid } = useParams();
    const [course, setCourse] = useState([]);

    const [yearLevels, setYearLevels] = useState([]);

    const [noMaxStudent, setNoMaxStudent] = useState(false);

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
                });
        };

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
    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow overflow-hidden mb-6 text-center">
                {course.course_name &&
                    <>
                        <h1 className="text-4xl font-bold text-blue-600">
                            {course.course_name}
                        </h1>
                    </>
                }
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {yearLevels.map((yearLevel, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow overflow-hidden">
                        <div className="mb-4 flex justify-between">
                            <h2 className="text-xl font-bold inline-block self-center">{yearLevel.year_level_name}</h2>
                            <button
                                onClick={() => { createNewSection(yearLevel.id) }}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Add Section
                            </button>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#2980b9] text-white">
                                    <th className="text-left p-2">Section</th>
                                    <th className="text-left p-2">Students</th>
                                    <th className="text-left p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {yearLevel.year_section && yearLevel.year_section.map((section, index) => (
                                    <tr key={index}
                                        className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-[#e1e6ea]"}`}>
                                        <td className="p-2">{section.section}</td>
                                        <td className="p-2">{section.student_count}/{section.max_students}</td>
                                        <td className="p-2 space-x-2">
                                            <Link to={`${yearLevel.year_level_name.replace(/\s+/g, '-')}?section=${section.section}`}>
                                                <button
                                                    className="text-white px-2 py-1 rounded bg-primaryColor hover:opacity-80 active:opacity-90 active:bg-blue-700">
                                                    Subjects
                                                </button>
                                            </Link>
                                            <button
                                                className="bg-green-400 text-white px-2 py-1 rounded hover:bg-green-500">
                                                Students
                                            </button>
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