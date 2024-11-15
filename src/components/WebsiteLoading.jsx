import React from 'react';
import OCC_LOGO from '../images/OCC_LOGO.png';

const WebsiteLoading = () => {
    return (
        <div className="flex justify-center items-center w-full h-screen bg-[#3e5c76] text-white">
            <div className="space-y-2 flex flex-col items-center animate-fade-in">
                <img src={OCC_LOGO} alt="Logo" className="size-60" />
                <p className="text-4xl font-bold text-center">Opol Community College</p>
            </div>
        </div>
    );
};

export default WebsiteLoading;