import { useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";

function LoginPage() {
    const [form, setForm] = useState({
        user_id_no: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
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
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={form.password}
                                name="password"
                                onChange={handleFormChange}
                                className="mt-1 block w-full px-4 py-2 pr-10 border rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your password"
                                required
                            />
                            <div
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                )}
                            </div>
                        </div>

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
