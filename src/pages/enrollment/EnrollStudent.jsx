import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { capitalizeFirstLetter, convert24HourTimeToMinutes, convertToAMPM, getFirstLetter, hasTimeConflict } from "../../utilities/utils";
import { showToast } from "../../components/Toast";
import Toast from "../../components/Toast";
import { FiSearch } from "react-icons/fi";
import { FaCirclePlus } from "react-icons/fa6";
import AddNewStudentModal from "../GlobalFunction/AddNewStudentModal";
import { ImSpinner5 } from "react-icons/im";
import PreLoader from "../../components/preloader/PreLoader";
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
    const [yearSectionId, setYearSectionId] = useState(0);
    const [regularStudent, setRegularStudent] = useState(true);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (classes.length === 0) {
            setRegularStudent(false);
            return;
        }

        const allIdsPresent = classes.every(cls =>
            defaultClasses.some(defaultCls => defaultCls.id === cls.id)
        );

        if (allIdsPresent && classes.length === defaultClasses.length) {
            setRegularStudent(true);
        } else {
            setRegularStudent(false);
        }
    }, [classes]);


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
                        console.log(response.data.classes);
                        setDefaultClasses(response.data.classes);
                        setStudentType(response.data.studentType);
                        setYearSectionId(response.data.yearSectionId);
                    }
                })
                .finally(() => {
                    setFetching(false);
                })
        }

        getCourseName();
        getYearLevelSectionSectionSubjects();
    }, [])


    // USER CONTROL

    const [studentIdSearch, setStudentIdSearch] = useState('');
    const [subjectCode, setSubjectCode] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [searchingStudent, setSearchingStudent] = useState(false);
    const [searchingClasses, setSearchingClasses] = useState(false);
    const [studentFound, setStudentFound] = useState(true);
    const [classesFound, setClassesFound] = useState(true);
    const [studentAlreadyEnrrolled, setStudentAlreadyEnrrolled] = useState(false);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)

    const [studentInfo, setStudentInfo] = useState([]);
    const [subjectSearch, setSubjectSearch] = useState([]);

    const navigate = useNavigate();

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
            setStudentInfo([]);

            const getStudentInfo = async () => {
                setSearchingStudent(true)
                setStudentFound(true);
                await axiosInstance.get(`get-student-info-student-id-number/${e.target.value}`)
                    .then(response => {
                        console.log(response.data);
                        if (response.data.message === 'no user found') {
                            setStudentFound(false);
                        } else if (response.data.message === 'success') {
                            setStudentFound(true);
                            setStudentInfo(response.data.student);
                            setStudentAlreadyEnrrolled(false);
                        }
                        console.log(response.data);
                    })
                    .finally(() => {
                        setSearchingStudent(false);
                    })
            }
            if (e.target.value === '') return;
            getStudentInfo();
        }, 1000);

        setTypingTimeout(newTimeout);
    }

    // Handle search classes after 1secs on change
    const [typingTimeoutSubjectCode, setTypingTimeoutSubjectCode] = useState(null);
    const handleSubjectCodeChange = (e) => {

        if (e.target.value.includes(' ')) return;
        setSubjectCode(e.target.value);
        if (!e.target.value) return setSubjectSearch([]);

        if (typingTimeoutSubjectCode) {
            clearTimeout(typingTimeoutSubjectCode);
        }

        const newTimeout = setTimeout(() => {
            setSubjectSearch([])

            const getClasses = async () => {
                setSearchingClasses(true)
                setClassesFound(true);
                await axiosInstance.get(`get-classes/${e.target.value}`)
                    .then(response => {
                        console.log(response.data)
                        if (response.data.message === 'subject not found') {
                            setClassesFound(false)
                        } else if (response.data.message === 'success') {
                            setClassesFound(true)
                            setSubjectSearch(response.data.classes)
                        }
                    })
                    .finally(() => {
                        setSearchingClasses(false)
                    })
            }
            if (e.target.value === '') return;
            getClasses();
        }, 1000);

        setTypingTimeoutSubjectCode(newTimeout);
    }

    const detectConflict = (classDetails) => {
        const conflictExists = classes.find(classSchedule => hasTimeConflict(
            convert24HourTimeToMinutes(classSchedule.start_time),
            convert24HourTimeToMinutes(classSchedule.end_time),
            convert24HourTimeToMinutes(classDetails.start_time),
            convert24HourTimeToMinutes(classDetails.end_time)
        ) && classSchedule.day == classDetails.day);

        return !!conflictExists;
    };

    const [invalidFields, setInvalidFields] = useState([""]);

    const submitStudentClasses = async (e) => {
        setSubmitting(true);
        const invalidFields = [];

        if (!selesctedStudentType) invalidFields.push('student_type');
        if (!studentInfo.user_id) invalidFields.push('student_id');
        setInvalidFields(invalidFields);

        if (invalidFields.length > 0) {
            setSubmitting(false);
            return;
        }


        const data = JSON.stringify({ classes: classes });
        try {
            await axiosInstance.post(
                `enroll-student/${studentInfo.user_id}/${selesctedStudentType}/${yearSectionId}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
                .then(response => {
                    if (response.data.message === 'success') {
                        showToast('Enrolled successfully!', 'success');
                        setClasses(defaultClasses);
                        setStudentInfo([]);
                        setSubjectSearch([]);
                        setStudentAlreadyEnrrolled(false);

                        // Construct the link
                        const enrollmentLink = '/enrollment/' + courseid + '/students/' + yearlevel + '/' + section + '/cor?student-id=' + studentIdSearch;
                        console.log(enrollmentLink);

                        // Navigate to the constructed link using React Router
                        navigate(enrollmentLink);

                        // Reset state
                        setStudentIdSearch("");
                    } else if (response.data.message === 'student already enrolled') {
                        setStudentAlreadyEnrrolled(true);
                    }
                })

                .finally(() => {
                    setSubmitting(false);
                })
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
        }
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

                <div className="flex flex-col gap-2 space-y-4 h-auto p-4 bg-white rounded-lg shadow-light">
                    <h1 className="text-2xl font-semibold text-gray-800">Student Info <span className="text-sm text-black italic font-thin">(Add student details if freshman or transferee to create ID)</span></h1>
                    <div className="flex gap-4 items-center">
                        <div className="relative">
                            <label
                                htmlFor="student_type_id"
                                className="text-xs font-semibold text-gray-700 mb-1 absolute left-1 -top-2.5 bg-white px-1"
                            >
                                Student Type:
                            </label>
                            <p
                                htmlFor="student_type_id"
                                className="text-lg font-semibold text-red-500 mb-1 absolute -right-3 -top-3 px-1"
                            >
                                *
                            </p>
                            <select
                                value={selesctedStudentType}
                                onChange={(e) => { setSelesctedStudentType(e.target.value); }}
                                name="student_type_id"
                                className={`h-11 w-40 block pl-3 pr-3 cursor-pointer text-lg border ${invalidFields.includes('student_type') ? 'border-red-500' : 'border-black'} focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-lg rounded-md transition duration-200 ease-in-out ${!selesctedStudentType && 'text-gray-400'}`}
                            >
                                {!selesctedStudentType && <option value="" disabled className="text-gray-400">Select...</option>}
                                {studentType.map((type, index) => (
                                    <option key={index} value={type.id} className="text-black cursor-pointer">
                                        {type.student_type_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Add student details button appear when student type is freshman or transferee */}
                        {(selesctedStudentType == 1 || selesctedStudentType == 2) && (
                            <button
                                onClick={() => { setIsStudentModalOpen(true) }}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ease-in-out shadow hover:shadow-lg"
                            >
                                Add Student Details
                            </button>
                        )}
                    </div>

                    {/* Search Student ID no AND Student info */}
                    <div className="flex flex-col">
                        <div className="flex gap-4 items-center">
                            <div className="relative">
                                <label
                                    htmlFor="student_id"
                                    className="text-xs font-semibold text-gray-700 mb-1 absolute left-1 -top-2.5 bg-white px-1"
                                >
                                    Student ID No.
                                </label>
                                <p
                                    htmlFor="student_type_id"
                                    className="text-lg font-semibold text-red-500 mb-1 absolute -right-3 -top-3 px-1"
                                >
                                    *
                                </p>
                                <input
                                    type="text"
                                    value={studentIdSearch}
                                    name="student_id"
                                    onChange={handleStudentIdChange}
                                    className={`text-lg w-40 px-3 py-2 border ${invalidFields.includes('student_id') ? 'border-red-500' : 'border-black'} hover:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out`}
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
                                        {studentInfo.middle_name && getFirstLetter(studentInfo.middle_name) + '.'}</span> {' '}
                                    <span className="text-red-500">{studentAlreadyEnrrolled && 'is enrolled already!'}</span>
                                </p>
                            ) : !studentFound && <p className="text-red-500 text-2xl">Student not found!</p>}
                        </div>
                    </div>
                </div>

                {/* List of Student Classes */}
                <div className="flex flex-col space-y-4 h-auto p-4 bg-white rounded-lg shadow-lg">
                    <div className="col-span-3 space-y-2">
                        <div className="flex justify-between">
                            <h1 className="text-2xl font-semibold text-gray-800">Student Classes {' '}
                                <span className="text-sm text-black italic font-thin">(Student class turns red means there's conflict with another class you selected)
                                </span>
                            </h1>
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
                                    onClick={submitStudentClasses}
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

                {/* List of searched subjects/classes */}
                <div className="flex flex-col space-y-4 h-auto p-4 bg-white rounded-lg shadow-lg">
                    <div className="col-span-3 space-y-2">
                        <div className="flex justify-between">
                            <h1 className="text-2xl font-semibold text-gray-800">Search Classes {' '}
                                <span className="text-sm text-black italic font-thin">
                                    (A red background indicates a conflict of day and time with the added classes.)
                                </span>
                            </h1>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex gap-2 items-center">
                            <div className="relative w-min">
                                <label
                                    htmlFor="student_id"
                                    className="text-xs font-semibold text-gray-700 mb-1 absolute left-1 -top-2.5 bg-white px-1"
                                >
                                    Subject Code
                                </label>
                                <input
                                    type="text"
                                    value={subjectCode}
                                    name="student_id"
                                    onChange={handleSubjectCodeChange}
                                    className="pr-8 text-lg w-44 px-3 py-2 border border-black focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-lg rounded-md transition duration-200 ease-in-out"
                                    placeholder=""
                                    aria-label="Search for faculty members"
                                />
                                <FiSearch className="absolute right-1 top-2" size={30} color="black" />

                            </div>

                            {/* When Searching Student */}
                            {searchingClasses && <p className="text-blue-400 text-2xl">Searching Classes 🔍</p>}

                            {!classesFound && <p className="text-red-500 text-2xl">No classes found!</p>}

                        </div>
                        {subjectSearch.map((classSubject, index) => (
                            <div
                                key={index}
                                className={`border border-black grid grid-cols-[100px_100px_1fr_120px_180px_90px_auto] gap-4 items-center ${detectConflict(classSubject) ? 'bg-red-600 text-white' : 'bg-white text-black hover:bg-gray-200'}  p-2 rounded-lg transition duration-200 ease-in-out`}
                            >
                                <div className="">
                                    {classSubject.class_code}
                                </div>
                                <div className="">
                                    {classSubject.subject_code}
                                </div>
                                <div className="">
                                    {classSubject.descriptive_title}
                                </div>
                                <div className="">
                                    {classSubject.day}
                                </div>
                                <div className="">
                                    {convertToAMPM(classSubject.start_time)} - {convertToAMPM(classSubject.end_time)}
                                </div>
                                <div className="text-center">
                                    {classSubject.credit_units}
                                </div>
                                <FaCirclePlus
                                    onClick={() => {
                                        if ((detectConflict(classSubject)) || classes.find(classItem => classItem.subject_id === classSubject.subject_id)) {
                                            return;
                                        }
                                        setClasses(prevClasses => [...prevClasses, classSubject]);
                                    }}
                                    size={18}
                                    className={`transition duration-200 ease-in-out ${(detectConflict(classSubject)) || (classes.find(classItem => classItem.subject_id === classSubject.subject_id)) ? 'text-gray-700 cursor-not-allowed' : 'text-green-500 hover:text-green-400 cursor-pointer'}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Toast />
            <AddNewStudentModal setStudentIdSearch={setStudentIdSearch} open={isStudentModalOpen} setOpen={setIsStudentModalOpen} setStudentInfo={setStudentInfo} />
        </>
    );
}

export default EnrollStudent;