import { useEffect, useState } from "react";
import { formatPhoneNumber, isValidEmail, removeHyphens } from "../../utilities/utils";
import axiosInstance from "../../../axios/axiosInstance";
import { ImSpinner5 } from "react-icons/im";

function AddNewStudentModal({ setStudentIdSearch, open, setOpen, setStudentInfo }) {
    const [submitting, setSubmitting] = useState(false);
    const [userIdExist, setUserIdExist] = useState(false);
    const [isDefaultChecked, setIsDefaultChecked] = useState(true);

    const [step, setStep] = useState(1);

    const [warnings, setWarnings] = useState({});

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

    useEffect(() => {
        defaultPasswordChange()
    }, [form.last_name, form.birthday, isDefaultChecked])

    const [studentFormFields, setStudentFormFields] = useState([""]);

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


        console.log(invalidFields);

        setStudentFormFields(invalidFields);

        if (invalidFields.length > 0) {
            return;
        }
        setStep(step + 1);
    };

    const handleFormChange = (e) => {
        let value = e.target.value;
        const name = e.target.name;

        if (name === 'contact_number') {
            let formattedNumber = removeHyphens(value);

            if (isNaN(formattedNumber) || formattedNumber.length > 11) {
                return;
            }

            if (!formattedNumber) {
                setForm(prev => ({
                    ...prev,
                    [name]: '09'
                }));
                return;
            }

            if (!formattedNumber.startsWith('09')) {
                setForm(prev => ({
                    ...prev,
                    [name]: '09' + value
                }));
                return;
            }
        } else if (
            name === 'first_name' ||
            name === 'last_name' ||
            name === 'middle_name' ||
            name === 'present_address'
        ) {
            value = value.toUpperCase();
        } else if (name === 'zip_code') {
            if (value.includes(' ') || isNaN(value)) return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitUserInfo = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        const invalidFields = [];
        if (!form.present_address) invalidFields.push('present_address');
        if (!form.zip_code) invalidFields.push('zip_code');
        if (!form.contact_number || form.contact_number.length !== 11) invalidFields.push('contact_number');
        if (!form.email_address) invalidFields.push('email_address');

        setStudentFormFields(invalidFields);
        if (invalidFields.length > 0) {
            setSubmitting(false);
            return;
        }

        await axiosInstance.post(`add-new-student/`, form)
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
                    setOpen(false);
                    setStep(1);
                } else if (response.data.message === "User ID already exists") {
                    setUserIdExist(true);
                }
                setStudentIdSearch(response.data.userIdNo);
                setStudentInfo(response.data.student);
            }).finally(() => {
                setSubmitting(false);
            })
    }

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                    <div className="bg-white p-4 rounded-md w-96 h-[470px] overflow-y-auto flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-center mb-4">Add Student</h2>
                            {step === 1 && (
                                <>
                                    <div className="space-y-4">
                                        {/* First Name */}
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-600 absolute left-1 -top-2.5 bg-white px-1">First Name:</label>
                                            <input
                                                value={form.first_name}
                                                name="first_name"
                                                onChange={handleFormChange}
                                                type="text"
                                                className={`w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out ${studentFormFields.includes('first_name') && 'border-red-300'}`}
                                            />
                                        </div>

                                        {/* Middle Name */}
                                        <div className="relative">
                                            <label className="block text-sm font-medium  text-gray-600 absolute left-1 -top-2.5 bg-white px-1">Middle Name</label>
                                            <input
                                                value={form.middle_name}
                                                name="middle_name"
                                                onChange={handleFormChange}
                                                type="text"
                                                className={`w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out ${studentFormFields.includes('middle_name') && 'border-red-300'}`}
                                            />
                                        </div>

                                        {/* Last Name */}
                                        <div className="relative">
                                            <label className="block text-sm font-medium  text-gray-600 absolute left-1 -top-2.5 bg-white px-1">Last Name</label>
                                            <input
                                                value={form.last_name}
                                                name="last_name"
                                                onChange={handleFormChange}
                                                type="text"
                                                className={`w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out ${studentFormFields.includes('last_name') && 'border-red-300'}`}
                                            />
                                        </div>

                                        {/* Birthday */}
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-600 absolute left-1 -top-2.5 bg-white px-1">Birthday</label>
                                            <input
                                                value={form.birthday}
                                                name="birthday"
                                                onChange={handleFormChange}
                                                type="date"
                                                className={`w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out ${studentFormFields.includes('birthday') && 'border-red-300'}`}
                                            />
                                        </div>

                                        {/* Gender */}
                                        <div className={`relative`}>
                                            <label className="block text-sm text-gray-600 mb-1 absolute left-1 -top-2.5 bg-white px-1">Gender</label>
                                            <div className={`border rounded-md px-3 py-3 ${studentFormFields.includes('gender') ? 'border-red-300 rounded-md' : 'border-gray-300'}`}>
                                                <div className="flex items-center space-x-6">
                                                    <label className="flex items-center cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="female"
                                                            checked={form.gender === 'female'}
                                                            onChange={handleFormChange}
                                                            className="form-radio h-4 w-4 text-cyan-600 focus:ring-cyan-500 hover:bg-cyan-100 transition"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">Female</span>
                                                    </label>
                                                    <label className="flex items-center cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="male"
                                                            checked={form.gender === 'male'}
                                                            onChange={handleFormChange}
                                                            className="form-radio h-4 w-4 text-cyan-600 focus:ring-cyan-500 hover:bg-cyan-100 transition"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">Male</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <label className="block text-sm font-medium  text-gray-600 absolute left-1 -top-2.5 bg-white px-1">Address</label>
                                        <input
                                            value={form.present_address}
                                            name="present_address"
                                            onChange={handleFormChange}
                                            type="text"
                                            className={`w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out  ${studentFormFields.includes('present_address') && 'border-red-300'}`} />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium  text-gray-600 absolute left-1 -top-2.5 bg-white px-1">Zip code</label>
                                        <input
                                            value={form.zip_code}
                                            name="zip_code"
                                            onChange={handleFormChange}
                                            type="text"
                                            className={`w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out  ${studentFormFields.includes('zip_code') && 'border-red-300'}`} />
                                    </div>

                                    student                                <div className="relative">
                                        <label className="block text-sm font-medium  text-gray-600 absolute left-1 -top-2.5 bg-white px-1">Contact no.</label>
                                        <input
                                            value={formatPhoneNumber(form.contact_number)}
                                            name="contact_number"
                                            onChange={handleFormChange}
                                            type="text"
                                            className={`w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out ${studentFormFields.includes('contact_number') && 'border-red-300'}`} />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium  text-gray-600 absolute left-1 -top-2.5 bg-white px-1">Email</label>
                                        <input
                                            value={form.email_address}
                                            name="email_address"
                                            onChange={handleFormChange}
                                            type="email"
                                            className={`w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out ${studentFormFields.includes('email_address') && 'border-red-300'}`} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="relative flex justify-center items-center mt-2">
                                <button
                                    disabled={step === 1}
                                    type="button"
                                    onClick={() => { setStep(step - 1) }}
                                    className={`absolute left-0 bg-gray-200 ${step === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'} py-2 px-4 rounded-md`}
                                >
                                    Previous
                                </button>

                                <p className="text-center">{step}/2</p>

                                {step <= 1 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="absolute right-0 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        disabled={submitting}
                                        type="button"
                                        onClick={submitUserInfo}
                                        className="absolute right-0 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                Submitting
                                                <ImSpinner5 className="inline-block animate-spin ml-1" />
                                            </>
                                        ) : (
                                            "Submit"
                                        )}
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setOpen(false);
                                    setForm({
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
                                    setStep(1);
                                }}
                                className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-300">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddNewStudentModal;