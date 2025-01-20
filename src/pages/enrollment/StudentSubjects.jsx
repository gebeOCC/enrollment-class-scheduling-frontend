import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import PreLoader from "../../components/preloader/PreLoader";
import { convert24HourTimeToMinutes, convertToAMPM, detectOwnClassesConflict, formatFullNameFML, hasTimeConflict } from "../../utilities/utils";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
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
    const [oldClasses, setOldClasses] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [subjectCode, setSubjectCode] = useState('');
    const [subjectSearch, setSubjectSearch] = useState([]);
    const [classesFound, setClassesFound] = useState(true);
    const [searchingClasses, setSearchingClasses] = useState(false);
    const [editing, setEditing] = useState(false);
    const [studentSubjectIdToAddDelete, setStudentSubjectIdToAddDelete] = useState(0);
    const [enrolledStudentId, setEnrolledStudentId] = useState(0);

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
                    setOldClasses(response.data.classes);
                    setEnrolledStudentId(response.data.enrolledStudentId);
                }
            })
            .finally(() => {
                setFetching(false);
            });
    };

    useEffect(() => {
        getStudentEnrollmentSubjects();
    }, [courseid, yearlevel, section]);

    // Handle search classes after 1secs on change
    const [typingTimeoutSubjectCode, setTypingTimeoutSubjectCode] = useState(null);
    const handleSubjectCodeChange = (e) => {
        const { value } = e.target;

        if (value.includes(' ')) return;
        setSubjectCode(value);
        if (!value) return setSubjectSearch([]);

        if (typingTimeoutSubjectCode) {
            clearTimeout(typingTimeoutSubjectCode);
        }

        const newTimeout = setTimeout(() => {
            setSubjectSearch([])

            const getClasses = async () => {
                setSearchingClasses(true)
                setClassesFound(true);
                await axiosInstance.get(`get-classes/${value}`)
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
            if (value === '') return;
            getClasses();
        }, 1000);

        setTypingTimeoutSubjectCode(newTimeout);
    }

    const detectConflict = (classDetails) => {
        if (classDetails.start_time == 'TBA' || classDetails.day == 'TBA') {
            return false
        }
        // console.log(classDetails);
        
        const conflictExists = classes.find(classSchedule => hasTimeConflict(
            convert24HourTimeToMinutes(classSchedule.year_section_subjects.start_time),
            convert24HourTimeToMinutes(classSchedule.year_section_subjects.end_time),
            convert24HourTimeToMinutes(classDetails.start_time),
            convert24HourTimeToMinutes(classDetails.end_time)
        ) && classSchedule.year_section_subjects.day == classDetails.day);
        return !!conflictExists;
    };

    const removeClass = async (id) => {
        setSubmitting(true);
        setStudentSubjectIdToAddDelete(id);
        await axiosInstance.post(`remove-student-subject`, { id: id })
            .then(response => {
                if (response.data.message == 'success') {
                    setClasses(prevSubjects => prevSubjects.filter(subject => subject.id !== id));
                };
            })
            .finally(() => {
                setStudentSubjectIdToAddDelete(0);
                setSubmitting(false);
            })

    }

    const addClass = async (id) => {
        setSubmitting(true);
        setStudentSubjectIdToAddDelete(id);
        await axiosInstance.post(`add-student-subject`, { studentId: enrolledStudentId, id: id })
            .then(response => {
                if (response.data.message == 'success') {
                    getStudentEnrollmentSubjects();
                };
            })
            .finally(() => {
                setStudentSubjectIdToAddDelete(0);
                setSubmitting(false);
            })
    }

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

            <h1 className="flex flex-col p-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg shadow-light text-2xl font-semibold text-gray-800 border border-gray-200">
                <span className="text-gray-800 text-3xl font-bold tracking-wide">
                    {formatFullNameFML(studentInfo)}
                </span>
                <span className="text-gray-600 text-lg font-medium">
                    {studentInfo.user_id_no}
                </span>
            </h1>

            {/* List of Student Classes */}
            <div className="flex flex-col space-y-4 h-auto p-4 bg-white rounded-lg shadow-lg">
                <div className="col-span-3 space-y-2">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-semibold text-gray-800">Student Classes {' '}
                            {/* <span className="text-sm text-black italic font-thin">(Student class turns red means there's conflict with another class you selected)
                            </span> */}
                        </h1>
                        <div className="flex items-center p-2 rounded-2xl">
                            <label htmlFor="edit-toggle" className="mr-2 font-semibold text-gray-700">
                                Edit
                            </label>
                            <input
                                type="checkbox"
                                id="edit-toggle"
                                // checked={editing}
                                onChange={() => { setEditing(!editing) }}
                                aria-label="Toggle edit mode"
                                className="appearance-none w-12 h-6 bg-gray-400 rounded-full cursor-pointer transition duration-300 ease-in-out flex justify-start items-center
                                            checked:bg-blue-600
                                            after:content-['']
                                            after:block after:w-5 after:h-5 after:bg-white
                                            after:rounded-full after:shadow-md
                                            after:transition-all after:duration-300
                                            after:translate-x-1 checked:after:translate-x-6
                                            hover:shadow-lg focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="">
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
                            <FaCircleMinus size={20} className="text-transparent" />
                        </div>
                        {classes.length < 1 &&
                            <div className={`border grid grid-cols-[100px_100px_1fr_120px_180px_90px_auto] gap-4 items-center bg-white p-2 transition duration-200 ease-in-out`}>Empty</div>
                        }
                        {classes.map((classSubject, index) => (
                            <div
                                key={index}
                                className={`border border-transparent border-b-gray-800 grid grid-cols-[100px_100px_1fr_120px_180px_90px_auto] gap-4 items-center p-2 transition duration-200 ease-in-out ${detectOwnClassesConflict(classSubject.year_section_subjects, classes) ? 'bg-red-600 text-white' : 'text-black bg-white hover:bg-gray-200'}`}
                            >
                                <div>
                                    {classSubject.year_section_subjects.class_code}
                                </div>
                                <div>
                                    {classSubject.year_section_subjects.subject.subject_code}
                                </div>
                                <div>
                                    {classSubject.year_section_subjects.subject.descriptive_title}
                                </div>
                                <div className="flex flex-col">
                                    <div>
                                        {classSubject.year_section_subjects.day}
                                    </div>
                                    <div>
                                        {classSubject.year_section_subjects.subject_secondary_schedule?.day}
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        {classSubject.year_section_subjects.start_time != "TBA" ? (
                                            convertToAMPM(classSubject.year_section_subjects.start_time) + " - " + convertToAMPM(classSubject.year_section_subjects.end_time)
                                        ) : (
                                            <>TBA</>
                                        )}
                                    </div>
                                    <div>
                                        {classSubject.year_section_subjects.subject_secondary_schedule?.start_time !== "TBA" ? (
                                            <>
                                                {classSubject.year_section_subjects.subject_secondary_schedule?.start_time && convertToAMPM(classSubject.year_section_subjects.subject_secondary_schedule.start_time)}
                                                {classSubject.year_section_subjects.subject_secondary_schedule?.start_time && classSubject.year_section_subjects.subject_secondary_schedule?.end_time && ' - '}
                                                {classSubject.year_section_subjects.subject_secondary_schedule?.end_time && convertToAMPM(classSubject.year_section_subjects.subject_secondary_schedule.end_time)}
                                            </>
                                        ) : (
                                            <>TBA</>
                                        )}
                                    </div>
                                </div>
                                <div className="text-center">
                                    {classSubject.year_section_subjects.subject.credit_units}
                                </div>
                                {editing ? (
                                    <>
                                        {(submitting && studentSubjectIdToAddDelete == classSubject.year_section_subjects.id) ? (
                                            <ImSpinner5 size={20} className={`text-red-500 size-6 inline-block animate-spin ml-1`} />
                                        ) : (
                                            <>
                                                <FaCircleMinus
                                                    onClick={() => { if (!submitting) { removeClass(classSubject.id) } }}
                                                    size={20} className={`${submitting ? 'text-gray-500' : 'text-red-500'} hover:cursor-pointer hover:text-red-400`} />
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <FaCircleMinus size={20} className="text-transparent" />
                                )
                                }
                            </div>
                        ))}
                        <div className={`grid grid-cols-[100px_100px_1fr_120px_180px_90px_auto] gap-4 items-center mt-2 px-2`}>
                            <h1 className="col-start-5 text-md font-semibold text-end">Total units:</h1>
                            <h1 className="text-center text-md font-semibold">{classes.reduce((total, subject) => total + subject.year_section_subjects.subject.credit_units, 0)}</h1>
                            <FaCircleMinus size={20} className="text-transparent" />
                        </div>
                    </div>
                </div>
            </div>

            {/* List of searched subjects/classes */}
            {editing &&
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

                        {subjectSearch.map((searchClass, index) => (
                            <div
                                key={index}
                                className={`border border-black grid grid-cols-[100px_100px_1fr_120px_180px_90px_auto] gap-4 items-center ${detectConflict(searchClass) ? 'bg-red-600 text-white' : 'bg-white text-black hover:bg-gray-200'}  p-2 rounded-lg transition duration-200 ease-in-out`}
                            >
                                <div className="">
                                    {searchClass.class_code}
                                </div>
                                <div className="">
                                    {searchClass.subject_code}
                                </div>
                                <div className="">
                                    {searchClass.descriptive_title}
                                </div>
                                <div className="flex flex-col">
                                    <div>
                                        {searchClass.day}
                                    </div>
                                    <div>
                                        {searchClass.subject_secondary_schedule?.day}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div>
                                        {searchClass.start_time != "TBA" ? (
                                            convertToAMPM(searchClass.start_time) + " - " + convertToAMPM(searchClass.end_time)
                                        ) : (
                                            <>TBA</>
                                        )}
                                    </div>
                                    {searchClass.subject_secondary_schedule && (
                                        <div>
                                            {searchClass.subject_secondary_schedule?.start_time != "TBA" ? (
                                                convertToAMPM(searchClass.subject_secondary_schedule?.start_time) + " - " + convertToAMPM(searchClass.subject_secondary_schedule?.end_time)
                                            ) : (
                                                <>TBA</>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    {searchClass.credit_units}
                                </div>
                                {(submitting && studentSubjectIdToAddDelete == searchClass.id) ? (
                                    <ImSpinner5 size={20} className={`size-6 inline-block animate-spin ml-1 text-green-500 hover:text-green-400`} />
                                ) : (
                                    <>
                                        <FaCirclePlus
                                            onClick={() => {

                                                    if ((detectConflict(searchClass)) || classes.find(classItem => classItem.year_section_subjects.subject_id === searchClass.subject_id)) {
                                                    return;
                                                }
                                                if (!submitting) { addClass(searchClass.id) }
                                            }}
                                            size={18}
                                                className={`transition duration-200 ease-in-out ${(detectConflict(searchClass)) || (classes.find(classItem => classItem.year_section_subjects.subject_id === searchClass.subject_id)) ? 'text-gray-700 cursor-not-allowed' : ` ${submitting ? 'text-gray-500' : 'text-green-500 hover:text-green-400 cursor-pointer'} `}`}
                                        />
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}

export default StudentSubjects