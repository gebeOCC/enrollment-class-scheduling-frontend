import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-2xl mb-6">Page Not Found</p>
            <Link to="/" className="text-blue-500 hover:text-blue-700">
                Go back to Home
            </Link>
        </div>
    );
}

export default NotFound;
