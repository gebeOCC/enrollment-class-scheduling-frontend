import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../../axios/axiosInstance';
import { checkPasswordComplexity } from '../../utilities/utils';
import { PiSpinnerBold } from 'react-icons/pi';
import { FaExclamation } from 'react-icons/fa6';
import Loading from '../../components/Loading';
import { MdEdit } from "react-icons/md";
import { IoMdCloseCircle } from 'react-icons/io';

function FacultyDetails() {
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('faculty-id');
    const [facultyDetails, setStudentDetails] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [found, setFound] = useState(true);
    const [editingDepartment, setEditingDepartment] = useState(false);
    const [departments, setDepartments] = useState([]);

    const [password, setPassword] = useState("");
    const [passwordRequirements, setPasswordRequirements] = useState("");

    const getFacultyDetails = async () => {
        await axiosInstance.get(`get-faculty-details/${studentId}`)
            .then(response => {
                if (response.data.message == 'success') {
                    setStudentDetails(response.data.studentDetails);
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

    if (fetching) return <Loading />
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
        const { isValid } = checkPasswordComplexity(password); // Call the function to get the validity
        setPasswordRequirements(checkPasswordComplexity(password)); // Update the password validity state

        console.log(passwordRequirements)
        if (!isValid) {
            return;
        }

        await axiosInstance.post(`change-password/`, { id: facultyDetails.id, password: password })
            .then(response => {
                console.log(response.data);
            })
    };

    return (
        <div className='space-y-4'>
            <div className="w-full mx-auto shadow-sm bg-white rounded-xl p-8 text-gray-800">
                <div className="flex items-center mb-6 space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-blue-600">
                            <span className="text-2xl font-semibold text-blue-600">{facultyDetails.user_information.first_name[0]}</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{facultyDetails.user_information.first_name} {facultyDetails.user_information.middle_name} {facultyDetails.user_information.last_name}</h2>
                        <p className="text-sm text-gray-500">ID Number: {facultyDetails.user_id_no}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Gender:</span>
                        <span className="font-medium">{facultyDetails.user_information.gender}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Birthday:</span>
                        <span className="font-medium">{new Date(facultyDetails.user_information.birthday).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Contact:</span>
                        <span className="font-medium">{facultyDetails.user_information.contact_number}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium">{facultyDetails.user_information.email_address}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Address:</span>
                        <span className="font-medium">{facultyDetails.user_information.present_address}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Zip Code:</span>
                        <span className="font-medium">{facultyDetails.user_information.zip_code}</span>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white rounded-lg shadow-lg p-6 text-gray-800">
                <h3 className="text-2xl font-bold text-blue-600 mb-4"> Department</h3>

                <div className="bg-gray-100 rounded-md p-4">
                    {facultyDetails.faculty.department ? (
                        <>
                            {editingDepartment ? (
                                <p className="text-lg font-semibold text-gray-900 mt-1 flex items-center">
                                    <select
                                        onChange={setDepartment}
                                        className='cursor-pointer'
                                        name=""
                                        id=""
                                        value={facultyDetails.faculty.department.department_id}>
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
                                    <span className="text-blue-600 ml-2">
                                        <MdEdit onClick={editDepartment} className='cursor-pointer' />
                                    </span>
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
