import { useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";

function LoginPage() {
    const [form, setForm] = useState({
        user_id_no: '',
        password: ''
    });

    const [invalidCredentials, setInvalidCredentials] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleFormChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axiosInstance.post('/login', form)
            .then(response => {
                setLoading(false);
                if (response.data.message === 'success') {
                    window.location.reload();
                } else if (response.data.message === 'Invalid credentials') {
                    setInvalidCredentials(true);
                }
            })
            .catch(() => {
                setLoading(false);
                setInvalidCredentials(true);
            });
    };

    const handleForgotPassword = () => {
        console.log("Forgot Password clicked");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6 text-[#3e5c76]">Login</h2>

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
                            ID No.
                        </label>
                        <input
                            type="text"
                            id="idNumber"
                            value={form.user_id_no}
                            name="user_id_no"
                            onChange={handleFormChange}
                            className="mt-1 block w-full px-4 py-2 border rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your ID Number"
                            required
                        />
                    </div>

                    <div className="mb-6 relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={form.password}
                            name="password"
                            onChange={handleFormChange}
                            className="mt-1 block w-full px-4 py-2 border rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                        {invalidCredentials && <p className="text-red-500 text-xs mt-1">Invalid credentials. Please try again.</p>}
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 px-4 ${loading ? 'bg-gray-500' : 'bg-[#3e5c76]'} text-white font-semibold rounded-md hover:bg-[#3d7cb1] transition duration-300`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <button
                    onClick={handleForgotPassword}
                    className="w-full py-2 px-4 mt-2 text-[#3e5c76] font-semibold hover:text-[#3d7cb1] transition duration-300"
                >
                    Forgot Password?
                </button>
            </div>
        </div>
    );
}

export default LoginPage;
