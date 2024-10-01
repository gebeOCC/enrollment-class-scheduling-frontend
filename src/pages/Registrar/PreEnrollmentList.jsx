import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { capitalizeFirstLetter, convert24HourTimeToMinutes, convertToAMPM, getFirstLetter, hasTimeConflict } from "../../utilities/utils";
import Toast from "../../components/Toast";
import { showToast } from "../../components/Toast";

function PreEnrollmentList() {
    const [pendingList, setPendingList] = useState([]);
    const [enrolledList, setEnrolledList] = useState([]);
    const [latestStudents, setLatestStudents] = useState([]);
    const [studentPreEnrollmentSubjects, setStudentPreEnrollmentSubjects] = useState([]);
    const [sections, setSections] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjectClasses, setSubjectClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState({
        class_code: "",
        credit_units: 0,
        day: "",
        descriptive_title: "",
        end_time: "",
        faculty_id: 0,
        id: 0,
        room_id: 0,
        start_time: "",
        subject_code: "",
        subject_id: 0,
        year_section_id: 0,
    });

    const [studentToEnrollInfo, setStudentToEnrollInfo] = useState({});

    const [isCreateUserIdModal, setIsCreateUserIdModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [noUserIdCreated, setNoUserIdCreated] = useState(false);
    const [userIdExist, setUserIdExist] = useState(false);
    const [enrollStudent, setEnrollStudent] = useState(false);

    const [createdUserId, setCreatedUserId] = useState('');
    const [studentId, setStudentId] = useState('');
    const [selectedSection, setSelectedSection] = useState(0);
    const [preEnrollmentId, setPreEnrollmentId] = useState(0);

    const getLatestStudents = async () => {
        await axiosInstance.get(`get-latest-students`)
            .then(response => {
                setLatestStudents(response.data)
            })
    }

    const getYearLevelSectionSections = async (courseId, yearLevelId) => {
        await axiosInstance.get(`get-year-level-section-sections/${courseId}/${yearLevelId}`)
            .then(response => {
                if (response.data.message === 'success') {
                    setSections(response.data.subjects);
                    console.log(response.data.subjects);
                }
            })
    }

    const getYearLevelSectionSectionSubjects = async ($id) => {
        await axiosInstance.get(`get-year-level-section-section-subjects/${$id}`)
            .then(response => {
                if (response.data.message === 'success') {
                    setClasses(response.data.classes);
                    console.log(response.data.classes);
                }
            })
    }

    const getPreEnrollmentList = async () => {
        await axiosInstance.get(`get-pre-enrollment-list`)
            .then(response => {
                console.log(response.data)
                if (response.data.message === 'success') {
                    setEnrolledList(response.data.enrolled)
                    setPendingList(response.data.pending)
                }
            })
    }

    useEffect(() => {
        getPreEnrollmentList();
    }, []);

    const createUserId = async () => {
        setSubmitting(true)
        if (!createdUserId) {
            setNoUserIdCreated(true)
            setSubmitting(false)
            return;
        } else {
            setNoUserIdCreated(false)
        }

        await axiosInstance.post(`create-user-id/${studentId}`, { user_id_no: createdUserId })
            .then(response => {
                if (response.data.message === 'success') {
                    setCreatedUserId('')
                    setStudentId('');
                    setIsCreateUserIdModal(false);
                    getPreEnrollmentList();
                } else if (response.data.message === 'Student number exist') {
                    setUserIdExist(true)
                }
            })
            .finally(() => {
                setSubmitting(false)
            })
    }

    const getStudentPreEnrollmentSubjects = async (id) => {
        await axiosInstance.get(`student-pre-enrollment-subjects/${id}`)
            .then(response => {
                if (response.data.message === 'success') {
                    setStudentPreEnrollmentSubjects(response.data.subjects)
                };
            })
    }

    const getSubjectClasses = async (subjectId) => {
        // console.log(subjectId);
        await axiosInstance.get(`get-subject-classes/${subjectId}`)
            .then(response => {
                setSubjectClasses(response.data)
                console.log(response.data)
            })
    }

    const submitStudentClasses = async () => {
        setSubmitting(true);
        const data = JSON.stringify({ classes: classes });
        try {
            response = await axiosInstance.post(
                `submit-student-classes/${preEnrollmentId}/${studentToEnrollInfo.student_id}/${selectedSection}/${studentToEnrollInfo.student_type_id}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
                .then(response => {
                    if (response.data.message === 'success') {
                        getPreEnrollmentList();
                        showToast('Added successfully!', 'success');
                        setEnrollStudent(false);
                        setSelectedSection(0)
                    };
                })
                .finally(() => {
                    setSubmitting(false);
                })
            console.log(response.data)
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
        }
    }
    return (
        <>
            {!enrollStudent ? (
                <>
                    <div className="bg-white p-4 rounded-lg shadow overflow-hidden mb-6 text-center flex justify-center items-center">
                        <h1 className="text-4xl font-bold text-blue-600">
                            Pre Enrollment List
                        </h1>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white table-auto border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left border-b border-gray-300">#</th>
                                    <th className="py-3 px-6 text-left border-b border-gray-300">Name</th>
                                    <th className="py-3 px-6 text-left border-b border-gray-300">Course</th>
                                    <th className="py-3 px-6 text-left border-b border-gray-300">Year Level</th>
                                    <th className="py-3 px-6 text-left border-b border-gray-300">Student Type</th>
                                    <th className="py-3 px-6 text-center border-b border-gray-300">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {pendingList.map((pending, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                                        <td className="py-3 px-6 text-left">{capitalizeFirstLetter(pending.last_name)}, {capitalizeFirstLetter(pending.first_name)} {pending.middle_name && getFirstLetter(pending.middle_name) + '.'}</td>
                                        <td className="py-3 px-6 text-left">{pending.course_name_abbreviation}</td>
                                        <td className="py-3 px-6 text-left">{pending.year_level_name}</td>
                                        <td className="py-3 px-6 text-left">{pending.student_type_name}</td>
                                        <td className="py-3 px-6 text-center">
                                            {pending.user_id_no ? (
                                                <button
                                                    onClick={() => {
                                                        setStudentToEnrollInfo(pending);
                                                        setEnrollStudent(true);
                                                        getStudentPreEnrollmentSubjects(pending.student_id);
                                                        getYearLevelSectionSections(pending.course_id, pending.year_level_id)
                                                        setPreEnrollmentId(pending.id)
                                                    }}
                                                    className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 transition duration-200">Enroll
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        getLatestStudents()
                                                        setIsCreateUserIdModal(true)
                                                        setStudentId(pending.student_id)
                                                    }}
                                                    className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition duration-200">
                                                    Assign ID No
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {isCreateUserIdModal &&
                        (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-4 rounded-md w-1/1">
                                    <h2 className="text-lg font-bold mb-4">Create Student ID no.</h2>
                                    {/* Search Input */}
                                    <div>
                                        <input
                                            id="faculty-search"
                                            type="text"
                                            value={createdUserId}
                                            name="faculty_id"
                                            onChange={(e) => setCreatedUserId(e.target.value)}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent ${noUserIdCreated && 'border-red-300'}`}
                                            placeholder="New Student ID"
                                            aria-label="Search for faculty members"
                                        />
                                    </div>
                                    {userIdExist &&
                                        <h1 className="text-red-500 text-xs">Student Id Already existed</h1>
                                    }

                                    <h1 className="mt-4 text-black text-md">Recent Students:</h1>
                                    {/* Faculty List */}
                                    <div className="mb-4 max-h-60 overflow-y-auto">
                                        <ul className="divide-y divide-gray-200">
                                            {latestStudents.map((student, index) => (
                                                <li key={index} className="p-1 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                                    <div>
                                                        <span className="font-medium text-gray-900">{student.user_id_no}</span> -
                                                        <span className="ml-2 text-gray-700">{student.first_name},</span>
                                                        <span className="ml-2 text-gray-700">{student.last_name}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        type="button"
                                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 w-full"
                                        onClick={() => { createUserId() }}
                                    >
                                        Submit
                                    </button>
                                    <button
                                        disabled={submitting}
                                        type="button"
                                        className="w-full mt-2 border border-thirdColor text-thirdColor py-2 rounded-md hover:bg-thirdColor hover:text-white"
                                        onClick={() => {
                                            setIsCreateUserIdModal(false);
                                            setCreatedUserId('');
                                            setNoUserIdCreated(false);
                                            setUserIdExist(false);
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </>
            ) : (
                <>
                    <div className="bg-white p-4 rounded-lg shadow mb-6 text-center flex justify-center items-center">
                        <h1 className="text-4xl font-bold text-blue-600">Enroll Student</h1>
                    </div>

                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mb-4 w-32"
                        onClick={() => {
                            setEnrollStudent(false);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 self-center">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow-md max-h-min  col-span-3">
                            <p className="text-lg font-medium">Name: {studentToEnrollInfo.first_name} {studentToEnrollInfo.last_name}</p>
                            <p className="text-lg font-medium">Course: {studentToEnrollInfo.course_name_abbreviation}</p>
                            <p className="text-lg font-medium">Student Type: {studentToEnrollInfo.student_type_name}</p>
                            <p className="text-lg font-medium">Year Level: {studentToEnrollInfo.year_level_name}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-md col-span-3">
                            <h2 className="text-2xl font-semibold text-blue-500 mb-2">Subjects to Enroll</h2>
                            <ul className="space-y-3">
                                <li className="bg-gray-50 border rounded-lg shadow-sm flex gap-1 p-2 flex-col">
                                    {studentPreEnrollmentSubjects.map((subject, index) => {
                                        const classFound = classes.find((cls) => cls.subject_id === subject.subject_id);

                                        return (
                                            <div className="flex gap-2" key={index}>
                                                <svg
                                                    onClick={() => { getSubjectClasses(subject.subject_id) }}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="size-6 text-gray-500 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                                </svg>
                                                {classFound ? (
                                                    <del>
                                                        <p className="font-bold text-blue-600">{subject.subject_code} -</p>
                                                    </del>
                                                ) : (
                                                    <>
                                                        <p className="font-bold text-blue-600">{subject.subject_code} -</p>
                                                    </>
                                                )}
                                                <p className="text-gray-700">{subject.descriptive_title}</p>
                                            </div>
                                        );
                                    })}
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col col-span-3">
                            <label htmlFor="">Section</label>
                            <select
                                value={selectedSection}
                                className="w-[50%] mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md cursor-pointer mb-4"
                                onChange={(e) => {
                                    setSelectedSection(e.target.value)
                                    getYearLevelSectionSectionSubjects(e.target.value)
                                }}
                                name=""
                                id="">
                                {!selectedSection &&
                                    <option value={0} disabled>
                                        select section
                                    </option>
                                }
                                {sections.map((section, index) => (
                                    <option key={index} value={section.id}>
                                        {section.section} - {section.student_count}/{section.max_students}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="">Classes</label>
                            {subjectClasses.map((subjectClass, index) => (
                                <div key={index} className="flex justify-between items-center bg-white p-2 rounded shadow-sm mb-2">
                                    <h1>
                                        {subjectClass.course_name_abbreviation}-{subjectClass.year_level}{subjectClass.section} {subjectClass.subject_code} {subjectClass.day} {convertToAMPM(subjectClass.start_time)}-{convertToAMPM(subjectClass.end_time)}
                                    </h1>
                                    <div
                                        className="flex gap-2">
                                        {selectedClass.id === subjectClass.id ? (
                                            <svg
                                                onClick={() => {
                                                    setClasses((previousClasses) => [
                                                        ...previousClasses,
                                                        selectedClass, // Add selectedClass to the classes array
                                                    ]);

                                                    // Reset selectedClass to its default values
                                                    setSelectedClass({
                                                        class_code: "",
                                                        credit_units: 0,
                                                        day: "",
                                                        descriptive_title: "",
                                                        end_time: "",
                                                        faculty_id: 0,
                                                        id: 0,
                                                        room_id: 0,
                                                        start_time: "",
                                                        subject_code: "",
                                                        subject_id: 0,
                                                        year_section_id: 0,
                                                    });
                                                    // Reset subjectClasses to an empty array
                                                    setSubjectClasses([]);
                                                }}

                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="size-7 cursor-pointer text-green-500 hover:text-green-400">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <button
                                                    className="text-white px-2 rounded bg-[#00b6cf] hover:opacity-80 active:opacity-90"
                                                onClick={() => {
                                                    setSelectedClass({
                                                        class_code: subjectClass.class_code,
                                                        credit_units: subjectClass.credit_units,
                                                        day: subjectClass.day,
                                                        descriptive_title: subjectClass.descriptive_title,
                                                        end_time: subjectClass.end_time,
                                                        faculty_id: subjectClass.faculty_id,
                                                        id: subjectClass.id,
                                                        room_id: subjectClass.room_id,
                                                        start_time: subjectClass.start_time,
                                                        subject_code: subjectClass.subject_code,
                                                        subject_id: subjectClass.subject_id,
                                                        year_section_id: subjectClass.year_section_id,
                                                    })
                                                }}>
                                                compare
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col-span-3">
                            <h1 className="text-2xl font-semibold mb-4">Student Classes</h1>
                            <div className="space-y-2">
                                {classes.map((classSubject, index) => (
                                    <div key={index}
                                        className={`flex justify-between items-center bg-white p-2 rounded shadow-sm
                                    ${selectedClass.subject_id && hasTimeConflict(
                                            convert24HourTimeToMinutes(classSubject.start_time),
                                            convert24HourTimeToMinutes(classSubject.end_time),
                                            convert24HourTimeToMinutes(selectedClass.start_time),
                                            convert24HourTimeToMinutes(selectedClass.end_time)
                                        ) &&
                                                selectedClass.day.toUpperCase() === classSubject.day.toUpperCase()
                                                ? 'bg-red-500 text-red-400'
                                                : ''
                                            }`}>
                                        <div>
                                            <span className="font-semibold">{classSubject.subject_code}</span> - {classSubject.descriptive_title}  {classSubject.day} {convertToAMPM(classSubject.start_time)}-{convertToAMPM(classSubject.end_time)}
                                        </div>
                                        <svg
                                            onClick={() => {
                                                setClasses((prevSubjects) => prevSubjects.filter((_, i) => i !== index));
                                            }}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="size-7 cursor-pointer text-red-500 hover:text-red-400"
                                        >
                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                ))}
                            </div>

                            <button
                                disabled={classes.length < 1}
                                className={`mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded transition ${classes.length < 1 ? 'bg-gray-300' : 'hover:bg-blue-400 '}`}
                                onClick={submitStudentClasses}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </>
            )
            }
            <Toast />
        </>
    )
}

export default PreEnrollmentList;
