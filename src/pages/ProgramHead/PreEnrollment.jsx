import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../../axios/axiosInstance";

function PreEnrollment() {
    const { courses } = useAuth();
    const [yearLevels, setYearLevels] = useState([]);
    const [studentType, setStudentType] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchingStudent, setSearchingStudent] = useState(false);
    const [error, setError] = useState(null);
    const [studentId, setStudentId] = useState('');

    const [preEnrollmentDetails, setPreEnrollmentDetails] = useState({
        student_id: '',
        student_type_id: '',
        course_id: '',
        year_level_id: '',
    })

    useEffect(() => {
        const getYearLevels = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`pre-enrollment-startup`);
                setYearLevels(response.data.yearLevel);
                setStudentType(response.data.studentType);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        }

        getYearLevels();
    }, [])

    const getStudentIdLabel = () => {
        const selectedType = studentType.find(type => Number(type.id) === Number(preEnrollmentDetails.student_type_id));
        return selectedType && (selectedType.student_type_name === "Freshman" || selectedType.student_type_name === "Transferee")
            ? "Application no."
            : "Student ID number:";
    };

    const [typingTimeout, setTypingTimeout] = useState(null);

    const handleStudentIdChange = (e) => {

        if (preEnrollmentDetails.student_type_id) {
            setStudentId(e.target.value)
        } else {
            return;
        }

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        const newTimeout = setTimeout(() => {
            console.log('searching student')
        }, 1000);

        setTypingTimeout(newTimeout);
    }

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="space-y-4">
            <div className="flex flex-col w-40">
                <label htmlFor="course_id" className="text-sm font-semibold text-gray-700">Course:</label>
                <select
                    name="course_id"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={preEnrollmentDetails.course_id}
                    onChange={(e) => { setPreEnrollmentDetails(prev => ({ ...prev, [e.target.name]: e.target.value })) }}
                >
                    {!preEnrollmentDetails.course_id &&
                        <option value="" disabled></option>
                    }
                    {courses.map((course, index) => (
                        <option key={index} value={course.id}>{course.course_name_abbreviation}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col w-40">
                <label htmlFor="year_level_id" className="text-sm font-semibold text-gray-700">Year Level:</label>
                <select
                    name="year_level_id"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={preEnrollmentDetails.year_level_id}
                    onChange={(e) => { setPreEnrollmentDetails(prev => ({ ...prev, [e.target.name]: e.target.value })) }}
                >
                    {!preEnrollmentDetails.year_level_id &&
                        <option value="" disabled></option>
                    }
                    {yearLevels.map((yearLevel, index) => (
                        <option key={index} value={yearLevel.id}>{yearLevel.year_level_name}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col w-40">
                <label htmlFor="student_type_id" className="text-sm font-semibold text-gray-700">Student Type:</label>
                <select
                    name="student_type_id"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={preEnrollmentDetails.student_type_id}
                    onChange={(e) => { setPreEnrollmentDetails(prev => ({ ...prev, [e.target.name]: e.target.value })) }}
                >
                    {!preEnrollmentDetails.student_type_id &&
                        <option value="" disabled></option>
                    }
                    {studentType.map((studentType, index) => (
                        <option key={index} value={studentType.id}>{studentType.student_type_name}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col w-40">
                <label htmlFor="student_id" className="text-sm font-semibold text-gray-700">{getStudentIdLabel()}</label>
                <input
                    readOnly={!preEnrollmentDetails.student_type_id}
                    name="student_id"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={studentId}
                    onChange={handleStudentIdChange}
                />
            </div>

            {searchingStudent &&
                <>
                    Searching Student🔍
                </>
            }
        </div>
    );
};

export default PreEnrollment;
