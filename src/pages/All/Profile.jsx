import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { ImSpinner5 } from "react-icons/im";
import PreLoader from "../../components/preloader/PreLoader";

function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [incorrectPassword, setIncorrectPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const getUserInfo = async () => {
            await axiosInstance.get('get-user-info')
                .then(response => {
                    setUserInfo(response.data);
                })
                .catch(error => {
                    console.error("Error fetching user info:", error);
                });
        }
        getUserInfo();
    }, []);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        await axiosInstance.post('change-new-password', {
            current_password: currentPassword,
            password: newPassword,
        })
            .then(response => {
                if (response.data.message == 'success') {
                    setIsPasswordChanged(true);
                    setPasswordError('');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setIncorrectPassword(false);
                } else if (response.data.message == 'The current password is incorrect') {
                    setIncorrectPassword(true)
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    if (!userInfo) return <PreLoader />;

    const { user_information, user_id_no, user_role } = userInfo;
    const { first_name, last_name, middle_name, gender, birthday, contact_number, email_address, present_address, zip_code } = user_information;

    const toggleVisibility = (type) => {
        if (type === "current") setShowCurrentPassword(prev => !prev);
        if (type === "new") setShowNewPassword(prev => !prev);
        if (type === "confirm") setShowConfirmPassword(prev => !prev);
    };

    return (
        <div className="space-y-4">
            <div className="w-full bg-white rounded-lg shadow-light p-6">
                {/* User Info */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-semibold">{first_name} {last_name}</h2>
                    <p className="text-lg text-gray-600">{user_role}</p>
                    <p className="text-gray-500 text-sm">User ID: {user_id_no}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    {/* User Details */}
                    {[
                        { label: 'Full Name', value: `${first_name} ${middle_name} ${last_name}` },
                        { label: 'Gender', value: gender },
                        { label: 'Birthday', value: new Date(birthday).toLocaleDateString() },
                        { label: 'Contact Number', value: contact_number },
                        { label: 'Email Address', value: email_address },
                        { label: 'Present Address', value: present_address },
                        { label: 'Zip Code', value: zip_code }
                    ].map(({ label, value }, index) => (
                        <div key={index}>
                            <p className="font-medium text-gray-700">{label}</p>
                            <p>{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Change Password Form */}
            <div className="max-w-4xl w-full sm:w-1/2 bg-white rounded-lg shadow-light p-6">
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Change Password</h3>

                    {isPasswordChanged && (
                        <div className="mb-4 text-green-600">
                            <p>Password changed successfully!</p>
                        </div>
                    )}

                    {incorrectPassword && (
                        <div className="mb-4 text-red-600">
                            <p>Current password incorrect!</p>
                        </div>
                    )}

                    {passwordError && (
                        <div className="mb-4 text-red-600">
                            <p>{passwordError}</p>
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange}>
                        {/* Password Fields */}
                        {[
                            { label: "Current Password", value: currentPassword, setter: setCurrentPassword, showPassword: showCurrentPassword, toggleVisibility: () => toggleVisibility("current") },
                            { label: "New Password", value: newPassword, setter: setNewPassword, showPassword: showNewPassword, toggleVisibility: () => toggleVisibility("new") },
                            { label: "Confirm New Password", value: confirmPassword, setter: setConfirmPassword, showPassword: showConfirmPassword, toggleVisibility: () => toggleVisibility("confirm") }
                        ].map(({ label, value, setter, showPassword, toggleVisibility }, index) => (
                            <div className="mb-4" key={index}>
                                <label className="block text-sm font-medium text-gray-700">{label}</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={value}
                                        onChange={(e) => setter(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {submitting ? (
                                    <>
                                        Change Password
                                        <ImSpinner5 className="inline-block animate-spin ml-1" />
                                    </>
                                ) : (
                                    "Change Password"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;
