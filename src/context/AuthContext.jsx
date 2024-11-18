import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../../axios/axiosInstance';
import WebsiteLoading from '../components/WebsiteLoading';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [fetching, setFetching] = useState(true);
    const [userRole, setUserRole] = useState('');
    const [enrollmentOngoing, setEnrollmentOngoing] = useState(false);
    const [preparation, setPreparation] = useState(false);
    const [load, setLoad] = useState(true);
    const [courses, setCourses] = useState([]);
    const [enrollmentData, setEnrollmentData] = useState([]);
    const [firstName, setFirstName] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
            await axiosInstance.get('/user')
                .then(response => {
                    if (response.data.user_role) {
                        setUserRole(response.data.user_role);
                        setEnrollmentOngoing(response.data.enrollmentOngoing);
                        setPreparation(response.data.preparation);
                        setEnrollmentData(response.data.schoolYear);
                        if (response.data.courses.length > 0) {
                            setCourses(response.data.courses);
                        }
                        setFirstName(response.data.firstName)
                    }
                })
                .catch(error => {
                    console.error('Error fetching user role:', error);
                })
                .finally(() => {
                    setFetching(false);
                });
        }

        fetchUserRole();
        setTimeout(() => setLoad(false), 500);
    }, []);

    if (fetching || load) return <WebsiteLoading />
    
    return (
        <AuthContext.Provider value={{ userRole, fetching, enrollmentOngoing, preparation, courses, enrollmentData, firstName }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
