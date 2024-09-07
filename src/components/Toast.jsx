import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import './Toast.css'; // Import the custom CSS for animations

let toastHandler = null;

const Toast = () => {
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        toastHandler = ({ message, type }) => {
            setToast({ show: true, message, type });

            // Hide the toast after 3 seconds
            setTimeout(() => {
                setToast({ show: false, message: '', type: '' });
            }, 3000);
        };
    }, []);

    const typeStyles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white',
    };

    return (
        <CSSTransition
            in={toast.show}
            timeout={300}
            classNames="toast"
            unmountOnExit
        >
            <div
                className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${typeStyles[toast.type]}`}
            >
                <div className="text-xl">
                    {toast.type === 'success' && '✅'}
                    {toast.type === 'error' && '❌'}
                    {toast.type === 'warning' && '⚠️'}
                    {toast.type === 'info' && 'ℹ️'}
                </div>
                <div className="text-sm font-semibold">{toast.message}</div>
            </div>
        </CSSTransition>
    );
};

export const showToast = (message, type) => {
    if (toastHandler) {
        toastHandler({ message, type });
    }
};

export default Toast;
