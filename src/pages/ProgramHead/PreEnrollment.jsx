import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../../axios/axiosInstance";
import { capitalizeFirstLetter, formatPhoneNumber, getFirstLetter, removeHyphens } from "../../utilities/utils";
import Toast from "../../components/Toast";
import { showToast } from "../../components/Toast";

function PreEnrollment() {
    const { courses } = useAuth();
    const [yearLevels, setYearLevels] = useState([]);
    const [studentType, setStudentType] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [studentSubjects, setStudentSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchingStudent, setSearchingStudent] = useState(false);
    const [studentFound, setStudentFound] = useState(true);
    const [error, setError] = useState(null);
    const [studentId, setStudentId] = useState('');
    const [searchSubject, setSearchSubject] = useState('');
    const [studentName, setStudentName] = useState([]);

    const [preEnrollmentDetails, setPreEnrollmentDetails] = useState({
        student_id: '',
        student_type_id: '',
        course_id: '',
        year_level_id: '',
    })

    useEffect(() => {
        const getYearLevels = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`pre-enrollment-startup`);
                console.log(response)
                setYearLevels(response.data.yearLevel);
                setStudentType(response.data.studentType);
                setSubjects(response.data.subjects)
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        }

        getYearLevels();
    }, [])

    const studentNew = () => {
        const selectedType = studentType.find(type => Number(type.id) === Number(preEnrollmentDetails.student_type_id));
        return selectedType && (selectedType.student_type_name === "Freshman" || selectedType.student_type_name === "Transferee") ? true : false;
    };

    const [typingTimeout, setTypingTimeout] = useState(null);

    const handleStudentIdChange = (e) => {

        if (preEnrollmentDetails.student_type_id) {
            setStudentId(e.target.value)
        } else {
            return;
        }

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        if (e.target.value !== '') {
            const newTimeout = setTimeout(() => {
                if (studentNew()) {
                    const getStudentInfo = async () => {
                        setSearchingStudent(true)
                        await axiosInstance.get(`get-student-info-application-id/${e.target.value}`)
                            .then(response => {
                                if (response.data.message === 'no user found') {
                                    setStudentFound(false)
                                    setPreEnrollmentDetails(prev => ({
                                        ...prev,
                                        student_id: '',
                                    }))
                                } else if (response.data.message === 'success') {
                                    setStudentFound(true)
                                    setStudentName(response.data.student)
                                    setPreEnrollmentDetails(prev => ({
                                        ...prev,
                                        student_id: response.data.studentId,
                                    }))
                                }
                            })
                            .finally(() => {
                                setSearchingStudent(false)
                            })
                    }
                    getStudentInfo();
                } else {
                    const getStudentInfo = async () => {
                        setSearchingStudent(true)
                        await axiosInstance.get(`get-student-info-student-id-number/${e.target.value}`)
                            .then(response => {
                                console.log(response.data)
                                if (response.data.message === 'no user found') {
                                    setStudentFound(false)
                                    setPreEnrollmentDetails(prev => ({
                                        ...prev,
                                        student_id: '',
                                    }))
                                } else if (response.data.message === 'success') {
                                    setStudentFound(true)
                                    setStudentName(response.data.student)
                                    setPreEnrollmentDetails(prev => ({
                                        ...prev,
                                        student_id: response.data.studentId,
                                    }))
                                }
                            })
                            .finally(() => {
                                setSearchingStudent(false)
                            })
                    }
                    getStudentInfo();
                }
            }, 1000);

            setTypingTimeout(newTimeout);
        }
    }

    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)
    const [isDefaultChecked, setIsDefaultChecked] = useState(true);
    const [form, setForm] = useState({
        application_no: '',
        password: '',
        user_role: 'student',
        first_name: '',
        last_name: '',
        middle_name: '',
        gender: '',
        birthday: '',
        contact_number: '',
        email_address: '',
        present_address: '',
        zip_code: '',
    })

    const [step, setStep] = useState(1);

    const [warnings, setWarnings] = useState({});

    const nextStep = () => {
        let newWarnings = {};

        if (step === 1) {
            if (form.first_name === '') newWarnings.first_name = 'First name is required';
            if (form.middle_name === '') newWarnings.middle_name = 'Middle name is required';
            if (form.last_name === '') newWarnings.last_name = 'Last name is required';
            if (form.gender === '') newWarnings.gender = 'Gender is required';
            if (form.birthday === '') newWarnings.birthday = 'Birthday is required';

            if (Object.keys(newWarnings).length === 0) {
                setStep(step + 1);
            }
        } else if (step === 2) {
            if (form.present_address === '') newWarnings.present_address = 'Address is required';
            if (form.zip_code === '') newWarnings.zip_code = 'Zip code is required';
            if (form.contact_number === '' || form.contact_number.length < 11) newWarnings.contact_number = 'Contact number is required';
            if (form.email_address === '') newWarnings.email_address = 'Email address is required';

            if (Object.keys(newWarnings).length === 0) {
                setStep(step + 1);
            }
        }

        setWarnings(newWarnings);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'contact_number') {
            let formattedNumber = removeHyphens(value)
            if (isNaN(formattedNumber) || (form.contact_number.length == 11 && formattedNumber.length > 11)) {
                return;
            }
        }

        let inputValue = value;
        if (name === "first_name" || name === "last_name" || name === "middle_name" || name === "present_address") {
            inputValue = inputValue.toUpperCase();
        }

        setForm(prev => ({
            ...prev,
            [name]: inputValue
        }));
    };

    const lastName = form.last_name.toLowerCase();
    const birthYear = form.birthday.split('-')[0];
    const defaultPassword = lastName + birthYear;

    const defaultPasswordChange = () => {
        if (isDefaultChecked) {
            setForm(prev => ({
                ...prev,
                password: defaultPassword
            }));
        }
    }

    const submitUserInfo = async (event) => {
        event.preventDefault();
        // setSubmitting(true);
        console.log(form)
        await axiosInstance.post(`add-new-student/`, form)
            .then(response => {
                if (response.data.message === "success") {
                    setPreEnrollmentDetails(prev => ({
                        ...prev,
                        student_id: response.data.studentId,
                    }))
                    setStudentId(form.application_no)
                    setIsStudentModalOpen(false)
                    setStudentName({
                        first_name: form.first_name,
                        middle_name: form.middle_name,
                        last_name: form.last_name
                    });
                    setStudentFound(true)
                    setForm({
                        application_no: '',
                        password: '',
                        user_role: 'student',
                        first_name: '',
                        last_name: '',
                        middle_name: '',
                        gender: '',
                        birthday: '',
                        contact_number: '',
                        email_address: '',
                        present_address: '',
                        zip_code: '',
                    })
                    setStep(1)
                }
                console.log(response.data)
            }).finally(() => {
                // setSubmitting(false);
            })
    }

    useEffect(() => {
        defaultPasswordChange()
    }, [form.last_name, form.birthday, isDefaultChecked])

    const getYearLevelSubjects = async (yearLevelId) => {
        await axiosInstance.get(`get-course-year-level-sujects/${preEnrollmentDetails.course_id}/${yearLevelId}`)
            .then(response => {
                if (response.data.message === 'success') {
                    setStudentSubjects(response.data.subjects);
                }
            })
    }

    const submitStudentSubjects = async () => {
        console.log(studentSubjects);
        const data = JSON.stringify({ subjects: studentSubjects }); // Wrap in an object
        try {
            const response = await axiosInstance.post(
                `create-student-pre-enrollment/${preEnrollmentDetails.student_id}/${preEnrollmentDetails.student_type_id}/${preEnrollmentDetails.course_id}/${preEnrollmentDetails.year_level_id}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data.message === 'success') {
                showToast('Added successfully!', 'success')
                setPreEnrollmentDetails({
                    student_id: '',
                    student_type_id: '',
                    course_id: '',
                    year_level_id: '',
                })
                setStudentId('')
                setStudentName('')
            };
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div className="space-x-4 flex mb-4">
                <div className="flex flex-col w-40">
                    <label htmlFor="course_id" className="text-sm font-semibold text-gray-700">Course:</label>
                    <select
                        name="course_id"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={preEnrollmentDetails.course_id}
                        onChange={(e) => { setPreEnrollmentDetails(prev => ({ ...prev, [e.target.name]: e.target.value })) }}
                    >
                        {!preEnrollmentDetails.course_id &&
                            <option value="" disabled></option>
                        }
                        {courses.map((course, index) => (
                            <option key={index} value={course.hashed_course_id}>{course.course_name_abbreviation}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col w-40">
                    <label htmlFor="year_level_id" className="text-sm font-semibold text-gray-700">Year Level:</label>
                    <select
                        name="year_level_id"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={preEnrollmentDetails.year_level_id}
                        onChange={(e) => { setPreEnrollmentDetails(prev => ({ ...prev, [e.target.name]: e.target.value })); getYearLevelSubjects(e.target.value) }}
                    >
                        {preEnrollmentDetails.course_id &&
                            <>
                                {!preEnrollmentDetails.year_level_id &&
                                    <option value="" disabled></option>
                                }

                                {yearLevels.map((yearLevel, index) => (
                                    <option key={index} value={yearLevel.id}>{yearLevel.year_level_name}</option>
                                ))}
                            </>
                        }
                    </select>
                </div>

                <div className="flex flex-col w-40">
                    <label htmlFor="student_type_id" className="text-sm font-semibold text-gray-700">Student Type:</label>
                    <select
                        name="student_type_id"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={preEnrollmentDetails.student_type_id}
                        onChange={(e) => { setPreEnrollmentDetails(prev => ({ ...prev, [e.target.name]: e.target.value })) }}
                    >
                        {!preEnrollmentDetails.student_type_id &&
                            <option value="" disabled></option>
                        }
                        {studentType.map((studentType, index) => (
                            <option key={index} value={studentType.id}>{studentType.student_type_name}</option>
                        ))}
                    </select>
                </div>
            </div >

            <div className="flex space-x-4  mb-4">
                {studentNew() && !preEnrollmentDetails.student_id &&
                    <button
                        onClick={() => { setIsStudentModalOpen(true) }}
                        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-opacity-90 transition h-[36px]`}>
                        Add Student Details
                    </button>
                }

                <div className="flex flex-col w-40">
                    <label htmlFor="student_id" className="text-sm font-semibold text-gray-700">{studentNew() ? 'Application Number' : 'Student Id No'}</label>
                    <input
                        readOnly={!preEnrollmentDetails.student_type_id}
                        name="student_id"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={studentId}
                        onChange={handleStudentIdChange}
                    />
                </div>
            </div>

            {
                searchingStudent &&
                <>
                    Searching Student🔍
                </>
            }

            {
                !studentFound ?
                    (
                        <>
                            No Student Found
                        </>
                    ) : (
                        <>
                            {studentName.last_name &&
                                <td className="py-2 px-4">Student: {capitalizeFirstLetter(studentName.last_name)}, {capitalizeFirstLetter(studentName.first_name)} {getFirstLetter(studentName.middle_name)}.</td>
                            }
                        </>
                    )
            }

            <div className={`grid grid-cols-2 gap-6 ${preEnrollmentDetails.student_id === '' ? 'hidden' : ''}`}>
                {/* Subject Search Section */}
                <div>
                    <label htmlFor="subject_code" className="block text-lg font-medium text-gray-700">Search Subject</label>
                    <input
                        value={searchSubject}
                        onChange={(e) => setSearchSubject(e.target.value)}
                        name="subject_code"
                        type="text"
                        placeholder="Enter subject code"
                        className="mt-1 p-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    {/* Subjects List */}
                    {searchSubject !== "" &&
                        <div className="mt-4 h-80 max-h-80 overflow-y-auto space-y-2 border border-gray-300 rounded-md p-2">
                            {subjects.map((subject, index) => (
                                searchSubject !== "" && subject.subject_code.toLowerCase().includes(searchSubject.toLowerCase()) && (
                                    <div key={index} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                                        <div>
                                            <span className="font-semibold">{subject.subject_code}</span> - {subject.descriptive_title} ({subject.credit_units} units)
                                        </div>
                                        <svg
                                            onClick={() => {
                                                setStudentSubjects((prevSubjects) =>
                                                    prevSubjects.find((s) => s.subject_code === subject.subject_code)
                                                        ? prevSubjects
                                                        : [...prevSubjects, subject]
                                                );
                                            }}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="size-7 cursor-pointer text-green-500 hover:text-green-400">
                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )
                            ))}
                        </div>}
                </div>

                {/* Student Subjects Section */}
                <div>
                    <h1 className="text-2xl font-semibold mb-4">Student Subjects</h1>
                    <div className="space-y-2">
                        {studentSubjects.map((subject, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                                <div>
                                    <span className="font-semibold">{subject.subject_code}</span> - {subject.descriptive_title} ({subject.credit_units} units)
                                </div>
                                <svg
                                    onClick={() => {
                                        setStudentSubjects((prevSubjects) => prevSubjects.filter((_, i) => i !== index));
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

                    <div className="mt-4">
                        <span className="font-semibold">Total Units: </span>
                        <span>
                            {studentSubjects.reduce((total, subject) => total + subject.credit_units, 0)}
                        </span>
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled={studentSubjects.length < 1}
                        className={`mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded transition ${studentSubjects.length < 1 ? 'bg-gray-300' : 'hover:bg-blue-400 '}`}
                        onClick={submitStudentSubjects}
                    >
                        Submit
                    </button>
                </div>
            </div>

            {
                isStudentModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-4 rounded-md w-[600px] h-[515px] overflow-y-auto flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-center mb-2">Add Student</h2>
                                {step === 1 && (
                                    <>
                                        <div>
                                            {/* First Name */}
                                            <div className="mb-2">
                                                <label className="block text-sm font-medium">First Name:</label>
                                                <input
                                                    value={form.first_name}
                                                    name="first_name"
                                                    onChange={handleFormChange}
                                                    type="text"
                                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${warnings.first_name && 'border-red-300'}`}
                                                />
                                            </div>

                                            {/* Middle Name */}
                                            <div className="mb-2">
                                                <label className="block text-sm font-medium">Middle Name</label>
                                                <input
                                                    value={form.middle_name}
                                                    name="middle_name"
                                                    onChange={handleFormChange}
                                                    type="text"
                                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${warnings.middle_name && 'border-red-300'}`}
                                                />
                                            </div>

                                            {/* Last Name */}
                                            <div className="mb-2">
                                                <label className="block text-sm font-medium">Last Name</label>
                                                <input
                                                    value={form.last_name}
                                                    name="last_name"
                                                    onChange={handleFormChange}
                                                    type="text"
                                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${warnings.last_name && 'border-red-300'}`}
                                                />
                                            </div>

                                            {/* Gender */}
                                            <div className={`mb-2 ${warnings.birthday && 'border border-red-300'}`}>
                                                <label className="block text-sm font-medium">Gender</label>
                                                <div className="flex items-center space-x-4">
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="female"
                                                            checked={form.gender === 'female'}
                                                            onChange={handleFormChange}
                                                            className="form-radio"
                                                        />
                                                        <span className="ml-2">Female</span>
                                                    </label>
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="male"
                                                            checked={form.gender === 'male'}
                                                            onChange={handleFormChange}
                                                            className="form-radio"
                                                        />
                                                        <span className="ml-2">Male</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Birthday */}
                                            <div className="mb-2">
                                                <label className="block text-sm font-medium">Birthday</label>
                                                <input
                                                    value={form.birthday}
                                                    name="birthday"
                                                    onChange={handleFormChange}
                                                    type="date"
                                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${warnings.birthday && 'border-red-300'}`}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        <div className="mb-2">
                                            <label className="block text-sm font-medium">Address</label>
                                            <input
                                                value={form.present_address}
                                                name="present_address"
                                                onChange={handleFormChange}
                                                type="text"
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400  ${warnings.present_address && 'border-red-300'}`} />
                                        </div>

                                        <div className="mb-2">
                                            <label className="block text-sm font-medium">Zip code</label>
                                            <input
                                                value={form.zip_code}
                                                name="zip_code"
                                                onChange={handleFormChange}
                                                type="text"
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400  ${warnings.zip_code && 'border-red-300'}`} />
                                        </div>

                                        <div className="mb-2">
                                            <label className="block text-sm font-medium">Contact no.</label>
                                            <input
                                                value={formatPhoneNumber(form.contact_number)}
                                                name="contact_number"
                                                onChange={handleFormChange}
                                                type="text"
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400  ${warnings.contact_number && 'border-red-300'}`} />
                                        </div>

                                        <div className="mb-2">
                                            <label className="block text-sm font-medium">Email</label>
                                            <input
                                                value={form.email_address}
                                                name="email_address"
                                                onChange={handleFormChange}
                                                type="email"
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400  ${warnings.email_address && 'border-red-300'}`} />
                                        </div>
                                    </>
                                )}

                                {step === 3 && (
                                    <>
                                        <div className="mb-2">
                                            <label className="block text-sm font-medium">Applicatio no.</label>
                                            <input
                                                value={form.application_no}
                                                name="application_no"
                                                onChange={handleFormChange}
                                                type="text"
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400  ${warnings.user_id_no && 'border-red-300'}`} />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium">Password</label>
                                            <div className="flex items-center">
                                                <input
                                                    value={form.password}
                                                    name="password"
                                                    onChange={handleFormChange}
                                                    type="password"
                                                    disabled={isDefaultChecked}
                                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400  ${warnings.password && 'border-red-300'}`} />
                                                <label className="flex items-center ml-4 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox cursor-pointer"
                                                        checked={isDefaultChecked}
                                                        onClick={() => { setIsDefaultChecked(!isDefaultChecked) }}
                                                        onChange={defaultPasswordChange} />
                                                    <span className="ml-2 text-sm">Default <span className="text-gray-500">lastname1998</span></span>
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div>
                                <div className="flex justify-between mt-2">
                                    <button
                                        disabled={step === 1}
                                        type="button"
                                        onClick={() => { setStep(step - 1) }}
                                        className={`bg-gray-200 ${step === 1 ? 'opacity-50 cursor-not-allowed ' : 'hover:bg-gray-300'}py-2 px-4 rounded-md `}>
                                        Previous
                                    </button>

                                    <p className="self-center">{step}/3</p>
                                    {step <= 2 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={submitUserInfo}
                                            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                            Submit
                                        </button>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsStudentModalOpen(false)}
                                    className="w-full mt-4 border border-thirdColor text-thirdColor py-2 rounded-md hover:bg-thirdColor hover:text-white">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            <Toast />
        </>
    );
};

export default PreEnrollment;
