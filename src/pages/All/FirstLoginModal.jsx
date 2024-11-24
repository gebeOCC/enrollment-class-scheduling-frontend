import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const FirstLoginModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(true); // Modal starts visible
    const navigate = useNavigate();
    const location = useLocation();


    return (
        <>
            {isModalVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
                        <h2 className="text-lg font-bold text-gray-800">
                            Welcome! Please Update Your Password
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Since this is your first login, we recommend changing your
                            password for security purposes.
                        </p>
                        <div className="mt-4 flex justify-end">
                            <Link to={'/profile'}>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                                // onClick={handleChangePassword}
                                >
                                    Change Password
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FirstLoginModal;
