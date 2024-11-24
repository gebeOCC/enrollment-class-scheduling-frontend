import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../../axios/axiosInstance';
import { checkPasswordComplexity, copyText } from '../../utilities/utils';
import { FaCheck, FaExclamation, FaRegCopy } from 'react-icons/fa6';
import PreLoader from '../../components/preloader/PreLoader';

function StudentDetails() {
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('student-id');
    const [studentDetails, setStudentDetails] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [found, setFound] = useState(true);
    const [copied, setCopied] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordRequirements, setPasswordRequirements] = useState("");

    const getStudentDetails = async () => {
        await axiosInstance.get(`get-student-details/${studentId}`)
            .then(response => {
                if (response.data.message == 'success') {
                    setStudentDetails(response.data.studentDetails);
                } else if (response.data.message == 'student not found') {
                    setFound(false);
                }
            })
            .finally(() => {
                setFetching(false);
            });
    };

    useEffect(() => {
        getStudentDetails();
    }, [studentId]);

    const onRetry = () => {
        setFetching(true);
        setFound(true);

        getStudentDetails();
    };


    if (fetching) return <PreLoader />
    if (!found) {
        return (
            <div className="flex flex-col justify-center items-center h-full p-4 bg-transparent rounded-lg text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-4 flex items-center">
                    <FaExclamation className="text-5xl mr-2" /> Student not found!
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


    const {
        user_id_no,
        user_information: {
            first_name,
            last_name,
            middle_name,
            gender,
            birthday,
            contact_number,
            email_address,
            present_address,
            zip_code
        }
    } = studentDetails;

    const submitPassword = async () => {
        // const { isValid } = checkPasswordComplexity(password);
        // setPasswordRequirements(checkPasswordComplexity(password));

        // if (!isValid) {
        //     return;
        // }

        await axiosInstance.post(`change-password/`, { id: studentDetails.id, password: password })
            .then(response => {
                console.log(response.data);
            })
    };

    const handleCopy = () => {
        copyText(user_id_no).then((success) => {
            if (success) {
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
            } else {
                console.error('Failed to copy text.');
            }
        });
    };

    return (
        <div className='space-y-4'>
            <div className="w-full mx-auto shadow-light bg-white rounded-xl p-8 text-gray-800">
                <div className="flex items-center mb-6 space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-blue-600">
                            <span className="text-2xl font-semibold text-blue-600">{first_name[0]}</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{first_name} {middle_name} {last_name}</h2>
                        <div className="flex gap-1 text-gray-500 items-center">
                            <p className="text-md flex">ID Number: {user_id_no}</p>
                            {copied ? (
                                <FaCheck className="cursor-pointer" />
                            ) : (
                                <FaRegCopy className="cursor-pointer" onClick={handleCopy} />
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Gender:</span>
                        <span className="font-medium">{gender}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Birthday:</span>
                        <span className="font-medium">{new Date(birthday).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Contact:</span>
                        <span className="font-medium">{contact_number}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium">{email_address}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Address:</span>
                        <span className="font-medium">{present_address}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Zip Code:</span>
                        <span className="font-medium">{zip_code}</span>
                    </div>
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

export default StudentDetails;
