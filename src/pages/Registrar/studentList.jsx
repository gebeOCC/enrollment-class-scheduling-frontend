import { useState, useEffect } from "react"
import axiosInstance from "../../../axios/axiosInstance"
import { capitalizeFirstLetter, formatPhoneNumber, getFirstLetter, isValidEmail, removeHyphens } from "../../utilities/utils";
import * as XLSX from 'xlsx';

function Studentlist() {
    const [submitting, setSubmitting] = useState(false);
    const [userIdExist, setUserIdExist] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [searchBar, setSearchBar] = useState('')
    const [students, setStudents] = useState([])
    const [showCount, setShowCount] = useState(10);

    const [uploadingStudents, setUploadingStudents] = useState(false);
    const [totalUpload, setTotalUpload] = useState(0);
    const [totalStudentsInExcel, setTotalStudentsInExcel] = useState(0);
    const progressPercentage = ((totalUpload / totalStudentsInExcel) * 100).toFixed(2);
    useEffect(() => {
        axiosInstance.get(`get-student-list`)
            .then(response => {
                setStudents(response.data)
                console.table(response.data)
            })
    }, [])

    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)
    const [isDefaultChecked, setIsDefaultChecked] = useState(true);
    const [form, setForm] = useState({
        user_id_no: '',
        password: '',
        user_role: 'student',
        first_name: '',
        last_name: '',
        middle_name: '',
        gender: '',
        birthday: '',
        contact_number: '09',
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
            if (form.last_name === '') newWarnings.last_name = 'Last name is required';
            if (form.gender === '') newWarnings.gender = 'Gender is required';
            if (form.birthday === '') newWarnings.birthday = 'Birthday is required';

            if (Object.keys(newWarnings).length === 0) {
                setStep(step + 1);
            }
        } else if (step === 2) {
            if (form.present_address === '') newWarnings.present_address = 'Address is required';
            if (form.zip_code === '') newWarnings.zip_code = 'Zip code is required';
            if (form.contact_number === '' || form.contact_number.length !== 11) newWarnings.contact_number = 'Contact number is required';
            if (form.email_address === '' || !isValidEmail(form.email_address)) newWarnings.email_address = 'Email address is required';

            if (Object.keys(newWarnings).length === 0) {
                setStep(step + 1);
            }
        }

        setWarnings(newWarnings);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'contact_number') {
            let formattedNumber = removeHyphens(value);

            if (isNaN(formattedNumber) || formattedNumber.length > 11) {
                return;
            }

            if (!formattedNumber.startsWith('09')) {
                return;
            }
        }

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        if (form.first_name) {
            handleToUpperCase("first_name");
        }
        if (form.last_name) {
            handleToUpperCase("last_name");
        }
        if (form.middle_name) {
            handleToUpperCase("middle_name");
        }
        if (form.present_address) {
            handleToUpperCase("present_address");
        }
    }, [form.first_name, form.last_name, form.middle_name, form.present_address]);

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

    const [uploadExcelStudentList, setUploadExcelStudentList] = useState([]);

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            readExcel(uploadedFile);
        }
    };

    const readExcel = (file) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const headers = jsonData[0].slice(1);
            const zipCodeIndex = headers.indexOf("ZIP CODE");

            const totalStudents = jsonData.slice(1).length;

            setTotalStudentsInExcel(totalStudents);
            setUploadingStudents(true);

            const uploadPromises = jsonData.slice(1).map(row => {
                const student = {};
                headers.forEach((header, index) => {
                    if (index <= zipCodeIndex) {
                        const cellValue = row[index + 1];
                        if (header === "BIRTH DATE (mm/dd/yy)" && typeof cellValue === 'number') {
                            const excelDate = new Date(Math.floor((cellValue - 25569) * 86400 * 1000));
                            student[header] = excelDate.toLocaleDateString("en-US");
                        } else {
                            student[header] = cellValue;
                        }
                    }
                });

                return axiosInstance.post(`import-students/`, {
                    user_id_no: student['STUDENT ID NO'] || '',
                    first_name: student['FIRST NAME'] || '',
                    last_name: student['LAST NAME'] || '',
                    middle_name: student['MIDDLE NAME'] || '',
                    gender: student['GENDER'] || '',
                    birthday: student['BIRTH DATE (mm/dd/yy)'] || '',
                    contact_number: student['Contact No.'] || '',
                    email_address: student['Email Address'] || '',
                    present_address: student['Present Address'] || '',
                    zip_code: student['ZIP CODE'] || '',
                }).then(response => {
                    if (response.data.message === "success") {
                        setUploadExcelStudentList(prevList =>
                            prevList.map(existingStudent =>
                                existingStudent.id_number === newStudent.id_number
                                    ? { ...existingStudent, uploading_status: true }
                                    : existingStudent
                            )
                        );
                        setTotalUpload(prevNum => prevNum + 1);
                        const newStudent = {
                            id_number: student['STUDENT ID NO'],
                            first_name: student['FIRST NAME'],
                            last_name: student['LAST NAME'],
                            uploading_status: false,
                        };

                        setUploadExcelStudentList(prevList => [...prevList, newStudent]);
                    }
                }).catch(error => {
                    console.error("Error uploading student:", error);
                });
            });

            await Promise.all(uploadPromises);
        };

        reader.readAsArrayBuffer(file);
    };

    const submitUserInfo = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        let newWarnings = {};

        if (form.user_id_no === '') newWarnings.user_id_no = 'User Id is required';

        setWarnings(newWarnings);

        if (Object.keys(newWarnings).length > 0) {
            setSubmitting(false);
            return;
        }

        await axiosInstance.post(`add-student/`, form)
            .then(response => {
                if (response.data.message === "success") {
                    setForm({
                        user_id_no: '',
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
                    });
                    setIsStudentModalOpen(false);
                } else if (response.data.message === "User ID already exists") {
                    setUserIdExist(true);
                }
            }).finally(() => {
                setSubmitting(false);
            })
    }

    const handleToUpperCase = (field) => {
        setForm((prev) => ({
            ...prev,
            [field]: prev[field].toUpperCase(),
        }));
    };

    useEffect(() => {
        defaultPasswordChange()
    }, [form.last_name, form.birthday, isDefaultChecked])

    return (
        <>
            <div className="p-6 bg-white shadow-md rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-3">
                        <h2 className="text-2xl font-bold">Student List</h2>
                        <select
                            value={showCount}
                            onChange={(e) => setShowCount(parseInt(e.target.value))}
                            className="border px-2 rounded-md"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                    <div className="flex space-x-2">
                        <input
                            value={searchBar}
                            onChange={(e) => { setSearchBar(e.target.value) }}
                            type="text"
                            placeholder="Search student..."
                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <label className="border border-green-500 text-green-500 px-6 py-2 rounded-md hover:bg-green-500 hover:text-white transition duration-300 cursor-pointer">
                            Import Excel
                            <input
                                type="file"
                                accept=".xls,.xlsx"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                        <button
                            onClick={() => { setIsStudentModalOpen(true) }}
                            className="bg-primaryColor text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Add Student
                        </button>

                    </div>
                </div>

                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="w-full bg-[#00b6cf] text-white text-left">
                            <th className="py-2 px-4">#</th>
                            <th className="py-2 px-4">Student ID no.</th>
                            <th className="py-2 px-4">Name</th>
                            <th className="py-2 px-4">Email</th>
                            <th className="py-2 px-4">Contact no.</th>
                            <th className="py-2 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students
                                .filter((student) => (
                                    searchBar === "" ||
                                    student.user_id_no.toLowerCase().includes(searchBar.toLowerCase()) ||
                                    (String(student.last_name) + String(student.first_name) + getFirstLetter(String(student.middle_name)))
                                        .toLowerCase().includes(searchBar.toLowerCase())
                                ))
                                .slice(0, showCount) // Show only the selected number of students
                                .map((student, index) => (
                                    <tr
                                        key={index}
                                        className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-[#deeced]"}`}
                                    >
                                        <td className="py-2 px-4">{index + 1}.</td>
                                        <td className="py-2 px-4">{student.user_id_no}</td>
                                        <td className="py-2 px-4">
                                            {capitalizeFirstLetter(student.last_name)}, {capitalizeFirstLetter(student.first_name)}{" "}
                                            {student.middle_name && getFirstLetter(student.middle_name) + '.'}
                                        </td>
                                        <td className="py-2 px-4">{student.email_address}</td>
                                        <td className="py-2 px-4">{student.contact_number}</td>
                                        <td className="py-2 px-4">Action</td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td className="py-2 px-4" colSpan="6">
                                    No Data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {
                uploadExcelStudentList.map((student, index) => (
                    <div key={index}>
                        {student.id_no}
                    </div>
                ))
            }

            {uploadingStudents && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col justify-between">
                        {/* Modal Header */}
                        <h1 className="text-3xl font-semibold text-center mb-4">
                            Uploading Students
                        </h1>

                        {/* Warning Message */}
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-4">
                            <p className="text-center font-medium">
                                Please do not close or refresh the browser while students are being uploaded.
                            </p>
                        </div>

                        {/* Progress Percentage */}
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-medium mb-2">
                                {progressPercentage}% Complete
                            </span>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                                <div
                                    className="bg-blue-600 h-4 rounded-full transition-all"
                                    style={{ width: `${progressPercentage}%` }}>
                                </div>
                            </div>

                            {/* Progress Details */}
                            <p className="text-gray-600">
                                {totalUpload} out of {totalStudentsInExcel} students uploaded
                            </p>
                        </div>

                        {/* Footer - Close Button */}
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => setUploadingStudents(false)}
                                disabled={progressPercentage !== "100.00"}
                                className={`px-4 py-2 rounded-md shadow-md transition ${progressPercentage === "100.00"
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isStudentModalOpen && (
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
                                        <label className="block text-sm font-medium">Student ID no.</label>
                                        <input
                                            value={form.user_id_no}
                                            name="user_id_no"
                                            onChange={handleFormChange}
                                            type="text"
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400  ${warnings.user_id_no && 'border-red-300'}`} />
                                        <div
                                            onClick={() => setShowPassword(prev => !prev)}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" // Center the icon vertically
                                        >
                                        </div>
                                        {userIdExist &&
                                            <p className="text-sm text-red-500">User Id number already exists</p>
                                        }
                                    </div>


                                    <div className="mb-4">
                                        <label className="block text-sm font-medium">Password</label>
                                        <div className="flex items-center">
                                            <div className="relative w-full">
                                                <input
                                                    value={form.password}
                                                    name="password"
                                                    onChange={handleFormChange}
                                                    type={showPassword ? "text" : "password"}
                                                    disabled={isDefaultChecked}
                                                    className={` w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400  ${warnings.password && 'border-red-300'}`} />
                                                <div
                                                    onClick={() => setShowPassword(prev => !prev)}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" // Center the icon vertically
                                                >
                                                    {showPassword ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>

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
                                        disabled={submitting}
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
            )}
        </>
    )
}

export default Studentlist