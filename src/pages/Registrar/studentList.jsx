import { useState, useEffect } from "react"
import axiosInstance from "../../../axios/axiosInstance"
import { formatPhoneNumber, removeHyphens } from "../../utilities/utils";
function Studentlist() {
    const [submitting, setSubmitting] = useState(false);
    const [searchBar, setSearchBar] = useState('')
    const [students, setStudents] = useState([])

    useEffect(() => {
        axiosInstance.get(`get-student-list`)
            .then(response => {
                setStudents(response.data)
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
            if (form.contact_number === '') newWarnings.contact_number = 'Contact number is required';
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
                password: defaultPassword
            }));
        }
    }

    const submitUserInfo = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        console.log(form)
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
                    setIsStudentModalOpen(false)
                }
                console.log(response.data)
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
                    <h2 className="text-2xl font-bold">Student List</h2>
                    <div className="flex space-x-2">
                        <input
                            value={searchBar}
                            onChange={(e) => { setSearchBar(e.target.value) }}
                            type="text"
                            placeholder="Search student..."
                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <button
                            onClick={() => { setIsStudentModalOpen(true) }}
                            className="bg-primaryColor text-white px-4 py-2 rounded-md hover:bg-blue-700">
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
                            students.map((student, index) => (
                                <>
                                    {(searchBar === "" || student.user_id_no.toLowerCase().includes(searchBar.toLowerCase()) || student.full_name.toLowerCase().includes(searchBar.toLowerCase())) &&
                                        <tr
                                            key={index}
                                            className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-[#deeced]"}`}
                                        >
                                            <td className="py-2 px-4">{student.id}</td>
                                            <td className="py-2 px-4">{student.user_id_no}</td>
                                            <td className="py-2 px-4">{student.full_name}</td>
                                            <td className="py-2 px-4">{student.email_address}</td>
                                            <td className="py-2 px-4">{student.contact_number}</td>
                                            <td className="py-2 px-4">Action</td>
                                        </tr>
                                    }
                                </>
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

            )}
        </>
    )
}

export default Studentlist