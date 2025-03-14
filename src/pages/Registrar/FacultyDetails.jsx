import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../../axios/axiosInstance';
import { checkPasswordComplexity, copyText } from '../../utilities/utils';
import { PiSpinnerBold } from 'react-icons/pi';
import { FaCheck, FaExclamation, FaRegCopy } from 'react-icons/fa6';
import PreLoader from '../../components/preloader/PreLoader';
import { MdEdit } from "react-icons/md";
import { IoMdCloseCircle } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';

function FacultyDetails() {
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('faculty-id');
    const [facultyDetails, setStudentDetails] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [found, setFound] = useState(true);
    const [editingDepartment, setEditingDepartment] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [copied, setCopied] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordRequirements, setPasswordRequirements] = useState("");

    const [studentInfoForm, setStudentInfoForm] = useState({});
    const [studentFormFields, setStudentFormFields] = useState([""]);
    const [editingStudentInfo, setEditingStudentInfo] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const getFacultyDetails = async () => {
        await axiosInstance.get(`get-faculty-details/${studentId}`)
            .then(response => {
                if (response.data.message == 'success') {
                    setStudentDetails(response.data.studentDetails);
                    setStudentInfoForm(response.data.studentDetails.user_information)
                } else if (response.data.message == 'student not found') {
                    setFound(false);
                }
                console.log(response.data)
            })
            .finally(() => {
                setFetching(false);
            });
    };

    useEffect(() => {
        getFacultyDetails();
    }, [studentId]);

    const onRetry = () => {
        setFetching(true);
        setFound(true);

        getFacultyDetails();
    };

    const getDepartments = async () => {
        console.log('fetch departments');
        await axiosInstance.get('get-departments')
            .then(response => {
                setDepartments(response.data);
            })
    }

    if (fetching) return < PreLoader />
    if (!found) {
        return (
            <div className="flex flex-col justify-center items-center h-full p-4 bg-transparent rounded-lg text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-4 flex items-center">
                    <FaExclamation className="text-5xl mr-2" /> Faculty not found!
                </h1>
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={onRetry}
                >
                    Try Again
                </button>
            </div>
        );
    }

    const editDepartment = () => {
        setEditingDepartment(true);
        if (!departments || Object.keys(departments).length === 0) {
            getDepartments();
        }
    }

    const setDepartment = async (e) => {
        console.log(e.target.value);
        await axiosInstance.post('set-faculty-department', { user_id: facultyDetails.id, department_id: e.target.value })
            .then(response => {
                if (response.data.message == 'success') {
                    getFacultyDetails();
                    setEditingDepartment(false);
                };
            })
    }

    const submitPassword = async () => {
        // const { isValid } = checkPasswordComplexity(password); // Call the function to get the validity
        // setPasswordRequirements(checkPasswordComplexity(password)); // Update the password validity state

        // console.log(passwordRequirements)
        // if (!isValid) {
        //     return;
        // }

        await axiosInstance.post(`change-password/`, { id: facultyDetails.id, password: password })
            .then(response => {
                console.log(response.data);
            })
    };

    const handleCopy = () => {
        copyText(facultyDetails.user_id_no).then((success) => {
            if (success) {
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
            } else {
                console.error('Failed to copy text.');
            }
        });
    };


    const studentInforChange = (e) => {
        const { name } = e.target
        let value = e.target.value

        if ((name === 'contact_number' || name === 'zip_code') && isNaN(value)) {
            return;
        }

        if (name === 'contact_number' && value.length > 11) {
            return;
        }

        if (name == 'first_name' || name == 'middle_name' || name == 'last_name') {
            value = value.toUpperCase();
        }

        setStudentInfoForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        setSubmitting(true);

        const invalidFields = [];
        if (!studentInfoForm.first_name) invalidFields.push('first_name');
        if (!studentInfoForm.last_name) invalidFields.push('last_name');
        if (!studentInfoForm.gender) invalidFields.push('gender');
        if (!studentInfoForm.birthday && studentDetails.user_information.birthday) invalidFields.push('birthday');
        if (!studentInfoForm.contact_number && studentDetails.user_information.contact_number) invalidFields.push('contact_number');
        if (!studentInfoForm.email_address && studentDetails.user_information.email_address) invalidFields.push('email_address');
        if (!studentInfoForm.present_address && studentDetails.user_information.present_address) invalidFields.push('present_address');

        console.log(studentInfoForm)
        setStudentFormFields(invalidFields);
        if (invalidFields.length > 0) {
            setSubmitting(false);
            return;
        }

        axiosInstance.post(`update-student-info/${facultyDetails.id}`, studentInfoForm)
            .then(response => {
                if (response.data.message == "success") {
                    setEditingStudentInfo(false);
                    getFacultyDetails();
                }
            })
            .finally(() => {
                setSubmitting(false);
            })
    }

    return (
        <div className='space-y-4'>
            <div className="w-full mx-auto shadow-sm bg-white rounded-xl p-8 text-gray-800">
                <div className="flex justify-between w-full">
                    <div className="flex items-center mb-6 space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-blue-600">
                                <span className="text-2xl font-semibold text-blue-600">{facultyDetails.user_information.first_name[0]}</span>
                            </div>
                        </div>
                        <div>
                            {!editingStudentInfo ? (
                                <h2 className="text-2xl font-bold">{facultyDetails.user_information.first_name} {facultyDetails.user_information.middle_name} {facultyDetails.user_information.last_name}</h2>
                            ) : (
                                <div className='flex gap-2'>
                                    <div className="flex flex-col">
                                        <input
                                            onChange={studentInforChange}
                                            value={studentInfoForm.first_name}
                                            className={`border border-gray-400 p-2 h-8 rounded-md focus:outline-blue-400 ${studentFormFields.includes('first_name') && 'border-red-600'}`}
                                            name='first_name'
                                            type="text" />
                                        <label className='text-sm' htmlFor="first_name">First name</label>
                                    </div>
                                    <div className="flex flex-col">
                                        <input
                                            onChange={studentInforChange}
                                            value={studentInfoForm.middle_name}
                                            className={`border border-gray-400 p-2 h-8 rounded-md focus:outline-blue-400 ${studentFormFields.includes('middle_name') && 'border-red-600'}`}
                                            name='middle_name'
                                            type="text" />
                                        <label className='text-sm ' htmlFor="middle_name">Middle name</label>
                                    </div>
                                    <div className="flex flex-col">
                                        <input
                                            onChange={studentInforChange}
                                            value={studentInfoForm.last_name}
                                            className={`border border-gray-400 p-2 h-8 rounded-md focus:outline-blue-400 ${studentFormFields.includes('last_name') && 'border-red-600'}`}
                                            name='last_name'
                                            type="text" />
                                        <label className='text-sm ' htmlFor="last_name">Last name</label>
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-1 text-gray-500 items-center">
                                <p className="text-md flex">ID Number: {facultyDetails.user_id_no}</p>
                                {copied ? (
                                    <FaCheck className="cursor-pointer" />
                                ) : (
                                    <FaRegCopy className="cursor-pointer" onClick={handleCopy} />
                                )}
                            </div>
                        </div>
                    </div>
                    {!editingStudentInfo &&
                        <CiEdit
                            onClick={() => setEditingStudentInfo(true)}
                            size={40}
                            className='text-blue-700 cursor-pointer' />}
                </div>
                <div className="grid grid-cols-1 gap-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Gender:</span>
                        {!editingStudentInfo ? (
                            <span className="font-medium">{facultyDetails.user_information.gender}</span>
                        ) : (
                            <select
                                onChange={studentInforChange}
                                value={studentInfoForm.gender || ''}
                                className={`text-center p-2 border border-gray-500 rounded-md focus:outline-blue-400 ${studentFormFields.includes('gender') && 'border-red-600'}`}
                                name="gender">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Birthday:</span>
                        <span className="font-medium">
                            {!editingStudentInfo ? (
                                <>
                                    {facultyDetails.user_information.birthday ? (
                                        <>
                                            {new Date(facultyDetails.user_information.birthday).toLocaleDateString()}
                                        </>
                                    ) : (
                                        "-"
                                    )}
                                </>
                            ) : (
                                <input
                                    onChange={studentInforChange}
                                    name='birthday'
                                    value={studentInfoForm.birthday || ''}
                                    type='date'
                                    className={`text-right p-2 border border-gray-500 h-8 rounded-md focus:outline-blue-400 ${studentFormFields.includes('birthday') && 'border-red-600'}`} />
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Contact:</span>
                        {!editingStudentInfo ? (
                            <span className="font-medium">{facultyDetails.user_information.contact_number || "-"}</span>
                        ) : (
                            <input
                                onChange={studentInforChange}
                                name='contact_number'
                                value={studentInfoForm.contact_number || ''}
                                className={`text-right p-2 border border-gray-500 h-8 rounded-md w-72 focus:outline-blue-400 ${studentFormFields.includes('contact_number') && 'border-red-600'}`} />
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Email:</span>
                        {!editingStudentInfo ? (
                            <span className="font-medium">{facultyDetails.user_information.email_address || "-"}</span>
                        ) : (
                            <input
                                onChange={studentInforChange}
                                name='email_address'
                                value={studentInfoForm.email_address || ''}
                                className={`text-right p-2 border border-gray-500 h-8 rounded-md w-72 focus:outline-blue-400 ${studentFormFields.includes('email_address') && 'border-red-600'}`} />
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Address:</span>
                        {!editingStudentInfo ? (
                            <span className="font-medium">{facultyDetails.user_information.present_address || "-"}</span>
                        ) : (
                            <input
                                onChange={studentInforChange}
                                name='present_address'
                                value={studentInfoForm.present_address || ''}
                                className={`text-right p-2 border border-gray-500 h-8 rounded-md w-72 focus:outline-blue-400 ${studentFormFields.includes('present_address') && 'border-red-600'}`} />
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Zip Code:</span>
                        {!editingStudentInfo ? (
                            <span className="font-medium">{facultyDetails.user_information.zip_code || "-"}</span>

                        ) : (
                            <input
                                onChange={studentInforChange}
                                name='zip_code'
                                value={studentInfoForm.zip_code || ''}
                                className={`text-right p-2 border border-gray-500 h-8 rounded-md w-72 focus:outline-blue-400 ${studentFormFields.includes('zip_code') && 'border-red-600'}`} />
                        )}
                    </div>
                    {editingStudentInfo &&
                        <div className='flex gap-2 justify-end'>
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded-sm hover:bg-gray-500"
                                onClick={() => {
                                    setEditingStudentInfo(false)
                                    setStudentInfoForm(facultyDetails.user_information)
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={submitting}
                                className="px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    }
                </div>
            </div>

            <div className="w-full bg-white rounded-lg shadow-lg p-6 text-gray-800">
                <h3 className="text-2xl font-bold text-blue-600"> Department</h3>
                {facultyDetails.user_role == 'program_head' &&
                    <h5>Program Head</h5>
                }

                <div className="bg-gray-100 rounded-md p-4">
                    {facultyDetails.faculty.department ? (
                        <>
                            {editingDepartment ? (
                                <p className="text-lg font-semibold text-gray-900 mt-1 flex items-center">
                                    <select
                                        onChange={setDepartment}
                                        className='cursor-pointer text-blue'
                                        name=""
                                        id=""
                                        value={facultyDetails.faculty.department_id}>
                                        {departments.map((department, index) => (
                                            <option key={index} value={department.id}>{department.department_name}</option>
                                        ))}
                                    </select>
                                    <span className="text-blue-600 ml-2">
                                        <IoMdCloseCircle onClick={() => setEditingDepartment(false)} className='cursor-pointer text-red-600' />
                                    </span>
                                </p>
                            ) : (
                                <p className="text-lg font-semibold text-gray-900 mt-1 flex items-center">
                                    {facultyDetails.faculty.department.department_name}
                                    {facultyDetails.user_role != 'program_head' &&
                                        <span className="text-blue-600 ml-2">
                                            <MdEdit onClick={editDepartment} className='cursor-pointer' />
                                        </span>
                                    }
                                </p>
                            )
                            }
                        </>
                    ) : (
                        <>
                            {editingDepartment ? (
                                <p className="text-lg font-semibold text-gray-900 mt-1 flex items-center">
                                    <select
                                        onChange={setDepartment}
                                        className='cursor-pointer'
                                        name=""
                                        id="">
                                        <option value="">select...</option>
                                        {departments.map((department, index) => (
                                            <option key={index} value={department.id}>{department.department_name}</option>

                                        ))}
                                    </select>
                                    <span className="text-blue-600 ml-2">
                                        <IoMdCloseCircle onClick={() => setEditingDepartment(false)} className='cursor-pointer text-red-600' />
                                    </span>
                                </p>
                            ) : (
                                <p className="text-lg font-semibold text-gray-900 mt-1 flex items-center">
                                    Not belong to any department
                                    <span className="text-blue-600 ml-2">
                                        <MdEdit onClick={editDepartment} className='cursor-pointer' />
                                    </span>
                                </p>
                            )
                            }
                        </>
                    )}
                </div>
            </div>

            <div className="w-full mx-auto shadow-light bg-white rounded-xl p-8 text-gray-800">
                <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                <div className="mb-4">
                    <label className="block text-gray-700">New Password</label>
                    <input
                        value={password}
                        type="password"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter new password"
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    {passwordRequirements &&
                        <div className='text-red-500'>
                            {(!passwordRequirements.requirements.length && 'Password should be at least 8 characters long.') ||
                                (!passwordRequirements.requirements.uppercase && 'Password should contain at least one uppercase letter.') ||
                                (!passwordRequirements.requirements.lowercase && 'Password should contain at least one lowercase letter.') ||
                                (!passwordRequirements.requirements.number && 'Password should contain at least one number.') ||
                                (!passwordRequirements.requirements.special && 'Password should contain at least one special character.')}
                        </div>
                    }
                </div>
                <button
                    onClick={submitPassword}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Change Password
                </button>
            </div>
        </div>
    );
}

export default FacultyDetails;
