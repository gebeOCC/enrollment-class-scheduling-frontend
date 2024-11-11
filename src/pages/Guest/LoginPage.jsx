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
        <div className="min-h-screen flex   flex-col items-center justify-center bg-gradient-to-r from-indigo-300 via-blue-400 to-indigo-500 px-5">
            <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md space-y-6 transform transition-all duration-300">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-4">Login</h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="idNumber" className="block text-sm font-semibold text-gray-700 mb-1">
                            ID No.
                        </label>
                        <input
                            type="text"
                            id="idNumber"
                            value={form.user_id_no}
                            name="user_id_no"
                            onChange={handleFormChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                            placeholder="Enter your ID Number"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={form.password}
                                name="password"
                                onChange={handleFormChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute inset-y-0 right-4 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {invalidCredentials && (
                            <p className="text-red-500 text-sm mt-2">Invalid credentials. Please try again.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 font-semibold text-white rounded-lg transition-all duration-300 transform ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} ${loading ? 'cursor-not-allowed' : 'hover:scale-105'}`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <button
                    onClick={handleForgotPassword}
                    className="w-full py-3 text-blue-600 font-medium hover:text-blue-800 transition duration-300"
                >
                    Forgot Password?
                </button>
            </div>
            <div className="pt-4 text-center space-y-2">
                <p className="text-sm text-gray-500">Developed by:</p>
                <div className="flex flex-col justify-center text-gray-700 text-sm">
                    <span>Barry T. Gebe</span>
                    <span>Daven Rose S. Areñola</span>
                    <span>Ferdinand Joe O. Bullanday</span>
                    <span>Irish Jean J. Tumarong</span>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
