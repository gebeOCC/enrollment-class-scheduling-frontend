import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../../axios/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [fetching, setFetching] = useState(true);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axiosInstance.get('/user');
                if (response.data.user_role) {
                    setUserRole(response.data.user_role);
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            } finally {
                setFetching(false);
            }
        };

        fetchUserRole();
    }, []);

    return (
        <AuthContext.Provider value={{ userRole, fetching }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
