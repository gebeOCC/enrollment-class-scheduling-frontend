import { useEffect, useState } from "react"
import axiosInstance from "../../../axios/axiosInstance";
import { capitalizeFirstLetter, formatPhoneNumber, getFirstLetter, isValidEmail, removeHyphens } from "../../utilities/utils";
import Toast from "../../components/Toast";
import { showToast } from "../../components/Toast";

function FacultyList() {
    const [submitting, setSubmitting] = useState(false);
    const [searchBar, setSearchBar] = useState('')
    const [faculties, setFaculties] = useState([])
    const [userIdExist, setUserIdExist] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const getFacultyList = () => {
        axiosInstance.get(`get-faculty-list`)
            .then(response => {
                setFaculties(response.data)
            })
    }

    useEffect(() => {
        getFacultyList();
    }, [])

    const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
    const [isDefaultChecked, setIsDefaultChecked] = useState(true);
    const [form, setForm] = useState({
        user_id_no: '',
        password: '',
        user_role: 'faculty',
        first_name: '',
        last_name: '',
        middle_name: '',
        gender: '',
        birthday: '',
        contact_number: '09',
        email_address: '',
        present_address: '',
        zip_code: '',
        department_id: '',
    })

    const [step, setStep] = useState(1);

    const [facultyFormFields, setFacultyFormFields] = useState([""]);

    const nextStep = () => {
        const invalidFields = [];

        if (step === 1) {
            if (!form.first_name) invalidFields.push('first_name');
            if (!form.last_name) invalidFields.push('last_name');
            if (!form.gender) invalidFields.push('gender');
            if (!form.birthday) invalidFields.push('birthday');
        } else if (step === 2) {
            if (!form.present_address) invalidFields.push('present_address');
            if (!form.zip_code) invalidFields.push('zip_code');
            if (!form.contact_number || form.contact_number.length !== 11) invalidFields.push('contact_number');
            if (!form.email_address || !isValidEmail(form.email_address)) invalidFields.push('email_address');
        }

        setFacultyFormFields(invalidFields);

        if (invalidFields.length > 0) {
            return;
        }
        setStep(step + 1);
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

    const handleToUpperCase = (field) => {
        setForm((prev) => ({
            ...prev,
            [field]: prev[field].toUpperCase(),
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

    const handleGenderChange = (e) => {
        setForm(prev => ({
            ...prev,
            gender: e.target.value
        }));
    };

    const lastName = form.last_name.toLowerCase();
    const birthYear = form.birthday.split('-')[0];
    const defaultPassword = lastName + birthYear;

    const defaultPasswordChange = () => {
        if (isDefaultChecked) {
            setForm(prev => ({
                ...prev,
                password: defaultPassword.replace(/\s+/g, '')
            }));
        }
    }

    useEffect(() => {
        defaultPasswordChange()
    }, [form.last_name, form.birthday, isDefaultChecked])

    const submitUserInfo = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        const invalidFields = [];
        if (!form.department_id) invalidFields.push('department_id');
        if (!form.user_id_no) invalidFields.push('user_id_no');
        if (!form.password) invalidFields.push('password');

        setFacultyFormFields(invalidFields);
        if (invalidFields.length > 0) {
            setSubmitting(false);
            return;
        }

        await axiosInstance.post(`add-faculty/`, form)
            .then(response => {
                if (response.data.message === "success") {
                    setForm({
                        user_id_no: '',
                        password: '',
                        user_role: 'faculty',
                        first_name: '',
                        last_name: '',
                        middle_name: '',
                        gender: '',
                        birthday: '',
                        contact_number: '09',
                        email_address: '',
                        present_address: '',
                        zip_code: '',
                        department_id: '',
                    });
                    setUserIdExist(false)
                    setIsFacultyModalOpen(false);
                    showToast(`Faculty Added Successfully`, 'success');
                    setStep(1);
                    getFacultyList();
                } else if (response.data.message === "User ID already exists") {
                    setUserIdExist(true);
                }
            }).finally(() => {
                setSubmitting(false);
            })
    }

    const [departments, setdepartments] = useState([]);

    useEffect(() => {
        axiosInstance.get(`get-departments`)
            .then(response => {
                setdepartments(response.data)
            })
    }, [])

    const departmentsData = departments.map((department) => (
        <option key={department.id} value={department.id}>
            {department.department_name_abbreviation}
        </option>
    ));

    departmentsData.unshift(
        <option key="default" disabled value="">
            Select dept...
        </option>
    );

    return (
        <>
            <div className="p-6 bg-white shadow-md rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Faculty List</h2>
                    <div className="flex space-x-2">
                        <input
                            value={searchBar}
                            onChange={(e) => { setSearchBar(e.target.value) }}
                            type="text"
                            placeholder="Search faculty..."
                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <button
                            onClick={() => { setIsFacultyModalOpen(true) }}
                            className="bg-primaryColor text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            Add Faculty
                        </button>
                    </div>
                </div>

                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="w-full bg-[#00b6cf] text-white text-left">
                            <th className="py-2 px-4">#</th>
                            <th className="py-2 px-4">Faculty ID no.</th>
                            <th className="py-2 px-4">Name</th>
                            <th className="py-2 px-4">Email</th>
                            <th className="py-2 px-4">Department</th>
                            <th className="py-2 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faculties.length > 0 ? (
                            faculties.map((faculty, index) => (
                                (searchBar === "" || faculty.user_id_no.toLowerCase().includes(searchBar.toLowerCase()) || (String(faculty.last_name) + String(faculty.first_name) + getFirstLetter(String(faculty.middle_name))).toLowerCase().includes(searchBar.toLowerCase())) &&
                                <tr
                                    key={index}
                                    className={`border-b ${faculty.id % 2 === 0 ? "bg-[#deeced]" : "bg-white"}`}
                                >
                                    <td className="py-2 px-4">{index + 1}.</td>
                                    <td className="py-2 px-4">{faculty.user_id_no}</td>
                                    <td className="py-2 px-4">{capitalizeFirstLetter(faculty.last_name)}, {capitalizeFirstLetter(faculty.first_name)} {faculty.middle_name && getFirstLetter(capitalizeFirstLetter(faculty.middle_name)) + '.'}</td>
                                    <td className="py-2 px-4">{faculty.email_address}</td>
                                    <td className="py-2 px-4">{faculty.department_name_abbreviation}</td>
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

            {isFacultyModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-md w-[600px] h-[515px] overflow-y-auto flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-center mb-2">Add Faculty </h2>
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
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${facultyFormFields.includes('first_name') && 'border-red-300'}`}
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
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${facultyFormFields.includes('middle_name') && 'border-red-300'}`}
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
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${facultyFormFields.includes('last_name') && 'border-red-300'}`}
                                            />
                                        </div>

                                        {/* Gender */}
                                        <div className={`mb-2  ${facultyFormFields.includes('gender') && 'border-red-300'}`}>
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
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${facultyFormFields.includes('birthday') && 'border-red-300'}`}
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
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400  ${facultyFormFields.includes('present_address') && 'border-red-300'}`} />
                                    </div>

                                    <div className="mb-2">
                                        <label className="block text-sm font-medium">Zip code</label>
                                        <input
                                            value={form.zip_code}
                                            name="zip_code"
                                            onChange={handleFormChange}
                                            type="text"
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400  ${facultyFormFields.includes('zip_code') && 'border-red-300'}`} />
                                    </div>

                                    <div className="mb-2">
                                        <label className="block text-sm font-medium">Contact no.</label>
                                        <input
                                            value={formatPhoneNumber(form.contact_number)}
                                            name="contact_number"
                                            onChange={handleFormChange}
                                            type="text"
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400  ${facultyFormFields.includes('contact_number') && 'border-red-300'}`} />
                                    </div>

                                    <div className="mb-2">
                                        <label className="block text-sm font-medium">Email</label>
                                        <input
                                            value={form.email_address}
                                            name="email_address"
                                            onChange={handleFormChange}
                                            type="email"
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400  ${facultyFormFields.includes('email_address') && 'border-red-300'}`} />
                                    </div>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium mb-1">Department</label>
                                        <select
                                            value={form.department_id}
                                            name="department_id"
                                            onChange={handleFormChange}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${facultyFormFields.includes('department_id') && 'border-red-300'}`}>
                                            {departmentsData}
                                        </select>
                                    </div>

                                    <div className="mb-2">
                                        <label className="block text-sm font-medium">Faculty ID no.</label>
                                        <input
                                            value={form.user_id_no}
                                            name="user_id_no"
                                            onChange={handleFormChange}
                                            type="text"
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400  ${facultyFormFields.includes('user_id_no') && 'border-red-300'}`} />
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
                                                    className={` w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400  ${facultyFormFields.includes('password') && 'border-red-300'}`} />
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
                                onClick={() => setIsFacultyModalOpen(false)}
                                className="w-full mt-4 border border-thirdColor text-thirdColor py-2 rounded-md hover:bg-thirdColor hover:text-white">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Toast />
        </>
    )
}

export default FacultyList