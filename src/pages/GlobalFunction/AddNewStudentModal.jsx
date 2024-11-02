import { useEffect, useState } from "react";
import { formatPhoneNumber, isValidEmail, removeHyphens } from "../../utilities/utils";
import axiosInstance from "../../../axios/axiosInstance";

function AddNewStudentModal({ open, setOpen }) {
    const [submitting, setSubmitting] = useState(false);
    const [userIdExist, setUserIdExist] = useState(false);
    const [isDefaultChecked, setIsDefaultChecked] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [step, setStep] = useState(1);

    const [warnings, setWarnings] = useState({});

    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)

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
        }

        setWarnings(newWarnings);
    };

    const handleFormChange = (e) => {
        let value = e.target.value;
        const name = e.target.name;

        if (name === 'contact_number') {
            let formattedNumber = removeHyphens(value);

            if (isNaN(formattedNumber) || formattedNumber.length > 11) {
                return;
            }

            if (!formattedNumber.startsWith('09')) {
                return;
            }

            value = formattedNumber;
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
        let newWarnings = {};

        if (form.present_address === '') newWarnings.present_address = 'Address is required';
        if (form.zip_code === '') newWarnings.zip_code = 'Zip code is required';
        if (form.contact_number === '' || form.contact_number.length !== 11) newWarnings.contact_number = 'Contact number is required';
        if (form.email_address === '' || !isValidEmail(form.email_address)) newWarnings.email_address = 'Email address is required';

        setWarnings(newWarnings);

        if (Object.keys(newWarnings).length !== 0) {
            return;
        }

        console.log('submit');

        event.preventDefault();
        setSubmitting(true);

        setWarnings(newWarnings);

        if (Object.keys(newWarnings).length > 0) {
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

                console.log(response.data.message)
            }).finally(() => {
                setSubmitting(false);
            })
    }

    return (
        <>
            {open && (
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

                                <p className="self-center">{step}/2</p>
                                {step <= 1 ? (
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
                                onClick={() => setOpen(false)}
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

export default AddNewStudentModal;