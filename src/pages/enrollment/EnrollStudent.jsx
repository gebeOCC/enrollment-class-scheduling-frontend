import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { useLocation, useParams } from "react-router-dom";
import { capitalizeFirstLetter, convertToAMPM, getFirstLetter } from "../../utilities/utils";
import axios from "axios";

function EnrollStudent() {
    // page start
    const { courseid, yearlevel } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const formattedYearLevel = yearlevel.replace(/-/g, ' ');
    const section = searchParams.get('section');
    const [courseName, setCourseName] = useState([]);
    const [classes, setClasses] = useState([]);
    const [defaultClasses, setDefaultClasses] = useState([]);
    const [studentType, setStudentType] = useState([]);
    const [selesctedStudentType, setSelesctedStudentType] = useState("");
    const [regularStudent, setRegularStudent] = useState(true);


    useEffect(() => {
        if (classes == defaultClasses) {
            setRegularStudent(true);
        } else {
            setRegularStudent(false);
        }
    }, [classes])

    useEffect(() => {
        const getCourseName = async () => {
            await axiosInstance.get(`get-course-name/${courseid}`)
                .then(response => {
                    setCourseName(response.data);
                });
        };

        const getYearLevelSectionSectionSubjects = async () => {

            const yearLevelNumber =
                yearlevel === 'First-Year' ? '1' :
                    yearlevel === 'Second-Year' ? '2' :
                        yearlevel === 'Third-Year' ? '3' :
                            yearlevel === 'Fourth-Year' ? '4' : '';

            await axiosInstance.get(`get-year-level-section-section-subjects/${courseid}/${yearLevelNumber}/${section}`)
                .then(response => {
                    if (response.data.message === 'success') {
                        setClasses(response.data.classes);
                        setDefaultClasses(response.data.classes);
                        setStudentType(response.data.studentType);
                    }
                })
        }

        // axios.get('https://api.api-ninjas.com/v1/quotes?category=happiness', {
        //     headers: { 'X-Api-Key': 'sxMO2mycQG5pA80izJIrTA==h4sI6d6YQztZwvLU' }
        // })
        //     .then(response => {
        //         console.log(response.data);
        //     })
        //     .catch(error => {
        //         console.error('Error fetching data:', error);
        //     });

        getCourseName();
        getYearLevelSectionSectionSubjects();
    }, [])

    // user control
    const [studentId, setStudentIdSearch] = useState('');
    const [searchingStudent, setSearchingStudent] = useState(false);
    const [studentFound, setStudentFound] = useState(true);
    const [studentInfo, setStudentInfo] = useState([]);

    // handle student search using id when 
    const [typingTimeout, setTypingTimeout] = useState(null);
    const handleStudentIdChange = (e) => {

        if (e.target.value.includes(' ')) return;
        setStudentIdSearch(e.target.value);
        if (!e.target.value) return setStudentInfo([]);

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        const newTimeout = setTimeout(() => {
            setStudentInfo([])

            const getStudentInfo = async () => {
                setSearchingStudent(true)
                setStudentFound(true);
                await axiosInstance.get(`get-student-info-student-id-number/${e.target.value}`)
                    .then(response => {
                        console.log(response.data)
                        if (response.data.message === 'no user found') {
                            setStudentFound(false)
                        } else if (response.data.message === 'success') {
                            setStudentFound(true)
                            setStudentInfo(response.data.student)
                        }
                        console.log(response.data)
                    })
                    .finally(() => {
                        setSearchingStudent(false)
                    })
            }
            if (e.target.value === '') return;
            getStudentInfo();
        }, 1000);

        setTypingTimeout(newTimeout);
    }

    const [selectedClass, setSelectedClass] = useState({
        class_code: "",
        credit_units: 0,
        day: "",
        descriptive_title: "",
        end_time: "",
        faculty_id: 0,
        id: 0,
        room_id: 0,
        start_time: "10:30",
        subject_code: "13:30",
        subject_id: 0,
        year_section_id: 0,
    });

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

            <div className="flex flex-col gap-2 space-y-4 h-auto p-4 bg-white rounded-lg shadow-light">
                <h1 className="text-2xl font-semibold text-gray-800">Student Info <span className="text-sm text-black italic font-thin">(Add student details if freshman or transferee to create ID)</span></h1>
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <label
                            htmlFor="student_type_id"
                            className="text-xs font-semibold text-gray-700 mb-1 absolute left-1 -top-2.5 bg-white px-1"
                        >
                            Student Type:
                        </label>
                        <select
                            value={selesctedStudentType}
                            onChange={(e) => { setSelesctedStudentType(e.target.value); }}
                            name="student_type_id"
                            className={`h-11 w-40 block pl-3 pr-3 cursor-pointer text-lg border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-lg rounded-md transition duration-200 ease-in-out ${!selesctedStudentType && 'text-gray-400'}`}
                        >
                            {!selesctedStudentType && <option value="" disabled className="text-gray-400">Select...</option>}
                            {studentType.map((type, index) => (
                                <option key={index} value={type.id} className="text-black cursor-pointer">
                                    {type.student_type_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {(selesctedStudentType == 1 || selesctedStudentType == 2) && (
                        <button
                            // onClick={() => { setIsStudentModalOpen(true) }}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ease-in-out shadow hover:shadow-lg"
                        >
                            Add Student Details
                        </button>
                    )}
                </div>

                {/* Search Student ID no AND Student info */}
                <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                        <div className="relative">
                            <label
                                htmlFor="student_id"
                                className="text-xs font-semibold text-gray-700 mb-1 absolute left-1 -top-2.5 bg-white px-1"
                            >
                                Student ID No.
                            </label>
                            <input
                                type="text"
                                value={studentId}
                                name="student_id"
                                onChange={handleStudentIdChange}
                                className="text-lg w-40 px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                                placeholder="Student ID no."
                                aria-label="Search for faculty members"
                            />
                        </div>

                        {/* When Searching Student */}
                        {searchingStudent && <p className="text-blue-400 text-2xl">Searching Student 🔍</p>}

                        {/* Student Info */}
                        {studentInfo.user_id ? (
                            <p className="text-gray-800 text-2xl">
                                <span className="font-semibold">Student: </span>
                                <span className=" underline">{capitalizeFirstLetter(studentInfo.last_name)}, {capitalizeFirstLetter(studentInfo.first_name)}{' '}
                                    {studentInfo.middle_name && getFirstLetter(studentInfo.middle_name) + '.'}</span>

                            </p>
                        ) : !studentFound && <p className="text-red-500 text-2xl">Student not found!</p>}
                    </div>
                </div>
            </div>

            {/* List of Student Classes */}
            <div className="flex flex-col space-y-4 h-auto p-4 bg-white rounded-lg shadow-lg">
                <div className="col-span-3 space-y-2">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-semibold text-gray-800">Student Classes <span className="text-sm text-black italic font-thin">(Student class turns red means there's conflict with another class you selected)</span></h1>
                        <div className="flex items-center space-x-2">
                            <span className="font-normal text-lg text-gray-700">Regular Student</span>
                            <input
                                className="cursor-pointer w-5 h-5"
                                checked={regularStudent}
                                onChange={(e) => {
                                    setRegularStudent(e.target.checked);
                                    if (e.target.checked) {
                                        setClasses(defaultClasses);
                                    } else {
                                        setClasses([]);
                                    }
                                }}
                                type="checkbox"
                                id="regularStudent"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div
                            className={`font-bold grid grid-cols-[100px_1fr_120px_180px_auto] gap-4 items-center bg-white px-2 transition duration-200 ease-in-out`}>
                            <div className="font-bold text-gray-700">
                                Subject code
                            </div>
                            <div className="text-gray-600">
                                Descriptive title
                            </div>
                            <div className="text-gray-600">
                                Day
                            </div>
                            <div className="text-gray-600">
                                Time
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
                        {classes.map((classSubject, index) => {
                            const hasConflict = selectedClass.subject_id &&
                                hasTimeConflict(
                                    convert24HourTimeToMinutes(classSubject.start_time),
                                    convert24HourTimeToMinutes(classSubject.end_time),
                                    convert24HourTimeToMinutes(selectedClass.start_time),
                                    convert24HourTimeToMinutes(selectedClass.end_time)
                                ) &&
                                selectedClass.day.toUpperCase() === classSubject.day.toUpperCase();

                            return (
                                <div
                                    key={index}
                                    className={`border grid grid-cols-[100px_1fr_120px_180px_auto] gap-4 items-center bg-white p-2 rounded-lg transition duration-200 ease-in-out ${hasConflict ? 'bg-red-500 text-white' : 'hover:bg-gray-100'}`}
                                >
                                    <div className="font-semibold text-gray-700">
                                        {classSubject.subject_code}
                                    </div>
                                    <div className="text-gray-600">
                                        {classSubject.descriptive_title}
                                    </div>
                                    <div className="text-gray-600">
                                        {classSubject.day}
                                    </div>
                                    <div className="text-gray-600">
                                        {convertToAMPM(classSubject.start_time)} - {convertToAMPM(classSubject.end_time)}
                                    </div>
                                    <svg
                                        onClick={() => setClasses(prevSubjects => prevSubjects.filter((_, i) => i !== index))}
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
                            );
                        })}
                        <button
                            disabled={classes.length < 1}
                            className={`mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg transition duration-200 ease-in-out ${classes.length < 1 ? 'bg-gray-300 cursor-not-allowed' : 'hover:bg-blue-400'}`}
                        // onClick={submitStudentClasses}
                        >
                            Enroll Student
                        </button>
                    </div>
                </div>
            </div>
            {/* List of Student Classes */}
            <div className="flex flex-col space-y-4 h-auto p-4 bg-white rounded-lg shadow-lg">
                <div className="col-span-3 space-y-2">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-semibold text-gray-800">Search Classes {' '}
                            <span className="text-sm text-black italic font-thin">
                                (Input subject code to search classes)
                            </span>
                        </h1>
                    </div>
                </div>
                <div className="relative">
                    <label
                        htmlFor="student_id"
                        className="text-xs font-semibold text-gray-700 mb-1 absolute left-1 -top-2.5 bg-white px-1"
                    >
                        Student ID No.
                    </label>
                    <input
                        type="text"
                        value={studentId}
                        name="student_id"
                        onChange={handleStudentIdChange}
                        className="text-lg w-40 px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                        placeholder="Student ID no."
                        aria-label="Search for faculty members"
                    />
                </div>
            </div>
        </div>
    );

}

export default EnrollStudent;