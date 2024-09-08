import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import Toast from "../../components/Toast";
import { showToast } from "../../components/Toast";

function CourseInfo() {
    const { courseid } = useParams();
    const [courseName, setCourseName] = useState('');
    const [curriculums, setCurriculums] = useState([]);
    const [schoolYears, setSchoolYear] = useState([])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [schoolYearId, setSchoolYearId] = useState('');

    useEffect(() => {
        const getCourseName = async () => {
            await axiosInstance.get(`get-course-name/${courseid}`)
                .then(response => {
                    setCourseName(response.data);
                });
        };

        const getCourseCurriculums = async () => {
            await axiosInstance.get(`get-course-curriculums/${courseid}`)
                .then(response => {
                    setCurriculums(response.data);
                });
        };

        const getSchoolYears = async () => {
            await axiosInstance.get(`get-school-years`)
                .then(response => {
                    console.log(response.data.school_years)
                    setSchoolYear(response.data.school_years)
                })
        }

        getCourseName();
        getCourseCurriculums();
        getSchoolYears()
    }, [courseid]);

    const handleAddCurriculum = async (event) => {
        event.preventDefault();
        console.log(courseid, schoolYearId)
        await axiosInstance.post(`add-course-curriculum/${courseid}`, { school_year_id: schoolYearId })
            .then(response => {
                // if (response.data.message === 'success') {
                //     setIsModalOpen(false);
                //     showToast('Added successfully!', 'success')
                // }
                console.log(response.data)
            });
    };

    const schoolYearsData = schoolYears.map((schoolYear) => (
        <>
            {schoolYear.semester_name === 'First' &&
                <option key={schoolYear.id} value={schoolYear.id}>
                    {schoolYear.school_year} {schoolYear.semester_name}-Semester
                </option>
            }
        </>
    ));

    schoolYearsData.unshift(
        <option key="default" disabled value="">
            Select school year...
        </option>
    );

    return (
        <div className="container mx-auto p-6">
            {/* Course Name */}
            <h1 className="text-3xl font-bold text-primaryColor mb-6">
                {courseName}
            </h1>

            {/* Add Curriculum Button */}
            <div className="mb-6">
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Curriculum
                </button>
            </div>

            {/* Curriculums Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {curriculums.map((curriculum, index) => (
                    <Link to={`curriculum?school_year=${curriculum.school_year}`} key={index}>
                        <div className="bg-white shadow-md p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-secondaryColor"># {index + 1}</h2>
                            <p className="text-gray-500">School Year: {curriculum.school_year}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Modal for Adding a New Curriculum */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-md w-2/4">
                            <h2 className="text-lg font-bold mb-4">Add New Curriculum</h2>
                            <form onSubmit={handleAddCurriculum}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">School Year</label>
                                    <select
                                        value={schoolYearId}
                                        name="school_year_id"
                                        onChange={(e) => { setSchoolYearId(e.target.value) }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
                                        {schoolYearsData}
                                    </select>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="bg-gray-500 text-white py-1 px-3 rounded-md mr-2"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-primaryColor text-white py-1 px-3 rounded-md"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            <Toast />
        </div >
    );
}

export default CourseInfo;
