import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import PreLoader from "../../components/preloader/PreLoader";
import { convertToAMPM, formatFullNameFML } from "../../utilities/utils";
import { ImSpinner5 } from "react-icons/im";

function StudentSubjects() {
    const { courseid, yearlevel, section } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [studentInfo, setStudentInfo] = useState([]);
    const studentId = searchParams.get('student-id');
    const [fetching, setFetching] = useState(true);
    const [course, setCourse] = useState([]);
    const [classes, setClasses] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const getStudentEnrollmentSubjects = async () => {
            const yearLevelNumber =
                yearlevel === 'First-Year' ? '1' :
                    yearlevel === 'Second-Year' ? '2' :
                        yearlevel === 'Third-Year' ? '3' :
                            yearlevel === 'Fourth-Year' ? '4' : '';

            await axiosInstance.get(`get-student-enrollment-subjects/${courseid}/${yearLevelNumber}/${section}/${studentId}`)
                .then(response => {
                    if (response.data.message === 'success') {
                        console.log(response.data);
                        setCourse(response.data.course);
                        setStudentInfo(response.data.studentInfo);
                        setClasses(response.data.classes);
                    }
                })
                .finally(() => {
                    setFetching(false);
                });
        };

        getStudentEnrollmentSubjects();
    }, [courseid, yearlevel, section]);

    if (fetching) return <PreLoader />

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex justify-center items-center ">
                <h1 className="text-4xl font-bold text-blue-600">
                    {course.course_name_abbreviation} -{' '}
                    {
                        { 'First-Year': '1', 'Second-Year': '2', 'Third-Year': '3', 'Fourth-Year': '4' }[yearlevel] || ''
                    }
                    {section}
                </h1>
            </div>

            <h1 className="flex flex-col gap-2 space-y-4 h-auto p-4 bg-white rounded-lg shadow-light text-2xl font-semibold text-gray-800">
                {studentInfo.user_id_no}, {formatFullNameFML(studentInfo)}
            </h1>

            {/* List of Student Classes */}
            <div className="flex flex-col space-y-4 h-auto p-4 bg-white rounded-lg shadow-lg">
                <div className="col-span-3 space-y-2">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-semibold text-gray-800">Student Classes {' '}
                            <span className="text-sm text-black italic font-thin">(Student class turns red means there's conflict with another class you selected)
                            </span>
                        </h1>
                    </div>
                    <div className="space-y-1">
                        <div
                            className={`font-bold text-gray-900 grid grid-cols-[100px_100px_1fr_120px_180px_90px_auto] gap-4 items-center bg-white px-2 transition duration-200 ease-in-out`}>
                            <div>
                                Class code
                            </div>
                            <div>
                                Subject code
                            </div>
                            <div>
                                Descriptive title
                            </div>
                            <div>
                                Day
                            </div>
                            <div>
                                Time
                            </div>
                            <div>
                                Credit units
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6 text-transparent transition duration-200 ease-in-out"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        {classes.length < 1 &&
                            <div className={`border grid grid-cols-[100px_100px_1fr_120px_180px_90px_auto] gap-4 items-center bg-white p-2 transition duration-200 ease-in-out`}>Empty</div>
                        }
                        {classes.map((classSubject, index) => (
                            <div
                                key={index}
                                className={`border border-black text-black grid grid-cols-[100px_100px_1fr_120px_180px_90px_auto] gap-4 items-center bg-white p-2 rounded-lg transition duration-200 ease-in-out hover:bg-gray-200`}
                            >
                                <div>
                                    {classSubject.class_code}
                                </div>
                                <div>
                                    {classSubject.subject_code}
                                </div>
                                <div>
                                    {classSubject.descriptive_title}
                                </div>
                                <div>
                                    {classSubject.day}
                                </div>
                                <div>
                                    {convertToAMPM(classSubject.start_time)} - {convertToAMPM(classSubject.end_time)}
                                </div>
                                <div className="text-center">
                                    {classSubject.credit_units}
                                </div>
                                <svg
                                    onClick={() => setClasses(prevSubjects => prevSubjects.filter(subject => subject.id !== classSubject.id))}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6 cursor-pointer text-red-500 hover:text-red-400 transition duration-200 ease-in-out"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        ))}
                        <div className={`grid grid-cols-[100px_100px_1fr_120px_180px_90px_auto] gap-4 items-center`}>
                            <button
                                disabled={classes.length < 1}
                                className={`w-full col-span-2 bg-blue-500 text-white py-2 px-4 rounded-lg transition duration-200 ease-in-out ${classes.length < 1 ? 'bg-gray-300 cursor-not-allowed' : 'hover:bg-blue-400'}`}
                                // onClick={submitStudentClasses}
                            >
                                {submitting ? (
                                    <>
                                        Enrolling
                                        <ImSpinner5 className="inline-block animate-spin ml-1" />
                                    </>
                                ) : (
                                    "Enroll Student"
                                )}
                            </button>
                            <h1 className="text-lg">Total units: {classes.reduce((total, subject) => total + subject.credit_units, 0)}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentSubjects