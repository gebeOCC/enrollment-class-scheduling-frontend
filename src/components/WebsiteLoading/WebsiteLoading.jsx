import React from 'react';
import './WebsiteLoading.css'

const WebsiteLoading = () => {
    return (
        <div className="flex justify-center items-center w-svh h-svh bg-[#3e5c76] text-white">
            <div className="space-y-2 flex flex-col items-center animate-fade-in">
                <div className="occ" />
            </div>
        </div>
    );
};

export default WebsiteLoading;