import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../../axios/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [fetching, setFetching] = useState(true);
    const [userRole, setUserRole] = useState('');
    const [enrollmentOngoing, setEnrollmentOngoing] = useState(false);
    const [preparation, setPreparation] = useState(false);
    const [courses, setCourses] = useState([]);
    const [enrollmentData, setEnrollmentData] = useState([]);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axiosInstance.get('/user');
                if (response.data.user_role) {
                    setUserRole(response.data.user_role);
                    setEnrollmentOngoing(response.data.enrollmentOngoing);
                    setPreparation(response.data.preparation);
                    setEnrollmentData(response.data.schoolYear);
                    if (response.data.courses.length > 0) {
                        setCourses(response.data.courses);
                    }
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            } finally {
                setFetching(false);
            }
        };
        fetchUserRole();
    }, []);

    if (fetching) {
        return <div></div>;
    }

    return (
        <AuthContext.Provider value={{ userRole, fetching, enrollmentOngoing, preparation, courses, enrollmentData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
