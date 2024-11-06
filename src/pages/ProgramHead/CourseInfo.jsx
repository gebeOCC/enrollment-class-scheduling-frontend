import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import Toast from "../../components/Toast";
import { showToast } from "../../components/Toast";

function CourseInfo() {
    const { courseid } = useParams();
    const [course, setCourse] = useState([]);
    const [curriculums, setCurriculums] = useState([]);
    const currentYear = new Date().getFullYear();
    const [form, setForm] = useState({
        school_year_start: currentYear.toString(),
        school_year_end: (currentYear + 1).toString(),
    });

    const [noSchoolYearStart, setNoSchoolYearStart] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [schoolYearId, setSchoolYearId] = useState('');

    const [noSchoolYearId, setNoSchoolYearId] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [curriCulumExist, setCurriCulumExist] = useState(false);

    const getCourseCurriculums = async () => {
        await axiosInstance.get(`get-course-curriculums/${courseid}`)
            .then(response => {
                setCurriculums(response.data);
            });
    };

    useEffect(() => {
        const getCourseName = async () => {
            await axiosInstance.get(`get-course-name/${courseid}`)
                .then(response => {
                    setCourse(response.data);
                });
        };

        getCourseName();
        getCourseCurriculums();
    }, [courseid]);

    const handleAddCurriculum = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        console.log(form);
        await axiosInstance.post(`add-course-curriculum/${courseid}`, { school_year_start: form.school_year_start, school_year_end: form.school_year_end })
            .then(response => {
                if (response.data.message === 'success') {
                    getCourseCurriculums();
                    setIsModalOpen(false);
                    showToast('Added successfully!', 'success')
                    setSchoolYearId('');
                } else if (response.data.message === 'Curriculum already exists') {
                    setCurriCulumExist(true);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleYearChange = (action) => {
        const startYear = parseInt(form.school_year_start, 10);
        if (action === 'increase') {
            setForm({
                ...form,
                school_year_start: (startYear + 1).toString(),
                school_year_end: (startYear + 2).toString(), // End year is always one year ahead
            });
        } else if (action === 'decrease' && startYear > 0) {
            setForm({
                ...form,
                school_year_start: (startYear - 1).toString(),
                school_year_end: (startYear).toString(), // Keep end year one year ahead
            });
        }
    };


    return (
        <>
            <h1 className="text-3xl font-bold text-primaryColor mb-4">
                {course.course_name}
            </h1>

            <div className="mb-6">
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Curriculum
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {curriculums.map((curriculum, index) => (
                    <Link to={`curriculum?school-year=${curriculum.school_year_start}-${curriculum.school_year_end}`} key={index}>
                        <div className="bg-white shadow-md p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-secondaryColor"># {index + 1}</h2>
                            <p className="text-gray-500">School Year: {curriculum.school_year_start} - {curriculum.school_year_end}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity ease-in-out duration-300">
                    <div className="bg-white p-6 rounded-lg w-96 max-w-md shadow-lg relative transition-transform transform scale-95">
                        <div className="bg-gray-100 px-4 py-2 rounded-t-lg shadow-sm mb-4">
                            <h2 className="text-center font-bold text-xl text-gray-800">Curriculum School Year</h2>
                        </div>

                        <form onSubmit={handleAddCurriculum}>
                            {/* School Year */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">School Year:</label>
                                <div className="flex justify-between gap-1 items-center">
                                    <button
                                        disabled={(currentYear - 5) === parseInt(form.school_year_start, 10)}
                                        type="button"
                                        onClick={() => handleYearChange('decrease')}
                                        className={`w-12 h-12 text-2xl font-semibold bg-gray-200 rounded-md text-gray-600 hover:bg-gray-300 transition duration-200 ${((currentYear - 5) === parseInt(form.school_year_start, 10)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        -
                                    </button>
                                    <p className="flex-1 text-center font-bold text-3xl text-gray-800">
                                        {`${form.school_year_start} - ${form.school_year_end}`}
                                    </p>
                                    <button
                                        disabled={(currentYear + 5) === parseInt(form.school_year_start, 10)}
                                        type="button"
                                        onClick={() => handleYearChange('increase')}
                                        className={`w-12 h-12 text-2xl font-semibold bg-gray-200 rounded-md text-gray-600 hover:bg-gray-300 transition duration-200 ${((currentYear + 5) === parseInt(form.school_year_start, 10)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {curriCulumExist && (
                                <p className="text-sm text-red-500 mb-4">Curriculum Already Exists</p>
                            )}

                            {/* Buttons */}
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md shadow hover:bg-gray-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    onClick={() => {
                                        setSchoolYearId('');
                                        setIsModalOpen(false);
                                        setCurriCulumExist(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



            <Toast />
        </ >
    );
}

export default CourseInfo;
