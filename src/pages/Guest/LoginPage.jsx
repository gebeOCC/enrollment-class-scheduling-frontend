import { useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import './Login.css'
import OCC_LOGO from '../../images/OCC_LOGO.png'
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage() {
    const [form, setForm] = useState({
        user_id_no: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [invalidCredentials, setInvalidCredentials] = useState(false);
    const [submitting, setsubmitting] = useState(false);

    const handleFormChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setsubmitting(true);
        await axiosInstance.post('/login', form)
            .then(response => {
                setsubmitting(false);
                if (response.data.message === 'success') {
                    window.location.reload();
                } else if (response.data.message === 'Invalid credentials') {
                    setInvalidCredentials(true);
                }
            })
            .catch(() => {
                setsubmitting(false);
                setInvalidCredentials(true);
            });
    };

    const handleForgotPassword = () => {
        console.log("Forgot Password clicked");
    };

    return (
        <div className="h-screen w-screen  min-h-screen flex flex-col items-center justify-center bg-gray-50 px-5">
            <section className="container">
                <div className="login-container">
                    <div className="form-container bg-white">
                        <h1 className="opacity mb-6 text-4xl font-semibold">LOGIN</h1>
                        <img src={OCC_LOGO} alt="illustration" className="illustration" />
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-6">
                                <input
                                    type="text"
                                    id="idNumber"
                                    value={form.user_id_no}
                                    name="user_id_no"
                                    onChange={handleFormChange}
                                    className="p-4 text-lg"
                                    required
                                    placeholder="ID NUMBER" />
                                <div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={form.password}
                                            name="password"
                                            onChange={handleFormChange}
                                            className="p-4 text-lg"
                                            required
                                            placeholder="PASSWORD" />
                                        <div
                                            type="button"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            className="absolute top-0 right-0 text-gray-400 hover:text-gray-500 max-w-min h-full bg-transparent flex justify-center items-center py-4 px-2 cursor-pointer"
                                        >
                                            {showPassword ? (
                                                <FaEye size={25} />
                                            ) : (
                                                <FaEyeSlash size={25} />
                                            )}
                                        </div>
                                    </div>
                                    {invalidCredentials && (
                                        <p className="text-red-500 text-sm">Invalid credentials. Please try again.</p>
                                    )}
                                </div>
                            </div>

                            <button
                                disabled={submitting}
                                className="">
                                {submitting ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        <div className="register-forget opacity text-black">
                            <a className="text-black cursor-pointer" onClick={() => handleForgotPassword()}>FORGOT PASSWORD</a>
                        </div>
                    </div>
                </div>
                <div className="theme-btn-container"></div>
            </section>
        </div>
    );
}

export default LoginPage;
