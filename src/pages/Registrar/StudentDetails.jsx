import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../../axios/axiosInstance';
import { checkPasswordComplexity } from '../../utilities/utils';

function StudentDetails() {
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('student-id');
    const [studentDetails, setStudentDetails] = useState(null);

    const [password, setPassword] = useState("");
    const [passwordRequirements, setPasswordRequirements] = useState("");

    useEffect(() => {
        const getStudentDetails = async () => {
            try {
                const response = await axiosInstance.get(`get-student-details/${studentId}`);
                setStudentDetails(response.data);
            } catch (error) {
                console.error('Error fetching student details:', error);
            }
        };

        getStudentDetails();
    }, [studentId]);

    if (!studentDetails) return <p className="text-gray-600">Loading...</p>;

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
        const { isValid } = checkPasswordComplexity(password); // Call the function to get the validity
        setPasswordRequirements(checkPasswordComplexity(password)); // Update the password validity state

        console.log(passwordRequirements)
        if (!isValid) {
            return;
        }

        await axiosInstance.post(`change-password/`, { id: studentDetails.id, password: password })
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
                            <span className="text-2xl font-semibold text-blue-600">{first_name[0]}</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{first_name} {middle_name} {last_name}</h2>
                        <p className="text-sm text-gray-500">ID Number: {user_id_no}</p>
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
