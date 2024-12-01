import { useState, useEffect, useRef } from 'react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import axiosInstance from '../../../../axios/axiosInstance';
import { formatFullName } from '../../../utilities/utils';
import PreLoader2 from '../../../components/preloader/PreLoader2';
import { PiSpinnerBold } from 'react-icons/pi';
import SkeletonStudentsAttendanceList from '../../../components/skeletons/SkeletonStudentsAttendanceList';
import { FaArrowRotateRight } from 'react-icons/fa6';
import { FaChevronDown, FaTrash } from 'react-icons/fa';

function TakeAttendance({ classId }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attendanceLoading, setAttendanceLoading] = useState(true);
    const [dateAttendanceStatusCountLoading, setDateAttendanceStatusCountLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [attendanceStatusCount, setAttendanceStatusCount] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get the month and year for the current calendar view
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    // Navigate to the previous month
    const goToPreviousMonth = () => {
        const prevDate = new Date(currentDate);
        prevDate.setMonth(currentDate.getMonth() - 1);
        setCurrentDate(prevDate);
    };

    // Navigate to the next month
    const goToNextMonth = () => {
        const nextDate = new Date(currentDate);
        nextDate.setMonth(currentDate.getMonth() + 1);
        setCurrentDate(nextDate);
    };

    // Set the selected date when a day is clicked
    const setDay = (day) => {
        const newDate = new Date(currentYear, currentDate.getMonth(), day);
        setSelectedDate(newDate);
    };

    // Check if a day is selected
    const isSelected = (day) => {
        return (
            selectedDate &&
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear()
        );
    };

    // Get the first day of the month for calendar alignment
    const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1).getDay();
    const adjustedFirstDay = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);

    // Get total days in the current month
    const totalDaysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();

    // Generate an array of days in the current month
    const days = Array.from({ length: totalDaysInMonth }, (_, index) => index + 1);

    // Format the selected date for display or API calls
    const getFormattedSelectedDate = () => {
        return selectedDate.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
    };

    // Effect to fetch attendance data when selectedDate changes
    useEffect(() => {
        if (selectedDate) {
            const formattedDate = getFormattedSelectedDate();
            getStudentAttendance(formattedDate);
        }
    }, [selectedDate]);

    const getStudentAttendance = async (date) => {
        setAttendanceLoading(true);
        console.log(date)
        await axiosInstance.get(`get-student-attendance/${classId}/${date}`)
            .then(response => {
                setStudents(response.data)
                console.log(response.data)
            })
            .finally(() => {
                setAttendanceLoading(false);
            })
    }

    const getClassAttendanceStatusCount = async () => {
        setDateAttendanceStatusCountLoading(true);
        await axiosInstance.get(`get-class-attendance-status-count/${classId}`)
            .then(response => {
                console.log(response.data)
                setAttendanceStatusCount(response.data)
            })
            .finally(() => {
                setDateAttendanceStatusCountLoading(false);
            })
    }

    useEffect(() => {
        getClassAttendanceStatusCount();
    }, [])

    useEffect(() => {
        if (!selectedDate) return;

        const formattedDate = getFormattedSelectedDate()

        getStudentAttendance(formattedDate);
    }, [selectedDate]);

    const statusOnChange = async (student_id, status, classId, id) => {
        // Log for debugging
        console.log(student_id, status, getFormattedSelectedDate(), classId, id);

        // Update the specific student's data
        const updatedStudents = students.map((student) => {
            if (student.student_id === student_id) {
                return {
                    ...student,
                    attendance_status: status, // Update attendance status
                    attendance_date: getFormattedSelectedDate(), // Update attendance date if needed
                };
            }
            return student;
        });

        // Update the state with the modified students array
        setStudents(updatedStudents);

        if (id) {
            console.log('has id')
            await axiosInstance.post(`update-student-attendance-status/${classId}/${status}/${student_id}/${getFormattedSelectedDate()}/${id}`)
        } else {
            console.log('no id')
            await axiosInstance.post(`create-student-attendance-status/${classId}/${status}/${student_id}/${getFormattedSelectedDate()}`)
                .then(response => {
                    console.log(response.data)
                })
        }
    };

    const [statusButtons, setStatusButtons] = useState(false);

    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setStatusButtons(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getStudents = async () => {
        await axiosInstance.get(`get-student-attendance/${classId}/${getFormattedSelectedDate()}`)
            .then(response => {
                setStudents(response.data)
                console.log(response.data)
            })
            .finally(() => {
                setAttendanceLoading(false);
            })
    }

    const markAllStatus = async (status) => {
        const updatedStudents = students.map(student => ({
            ...student,
            attendance_status: status
        }));

        setStudents(updatedStudents);
        setStatusButtons(false);

        await axiosInstance.post(`mark-all-attenance/${classId}/${getFormattedSelectedDate()}/${status}`)
            .then(response => {
                console.log(response.data)
            })
            .finally(() => {
                getStudents()
                getClassAttendanceStatusCount()
            })
    };

    // Function to delete attendance (reset status to empty)
    const deleteAttendance = async () => {
        const resetStudents = students.map(student => ({
            ...student,
            attendance_status: null,
            id: null,
        }));

        setStudents(resetStudents);

        await axiosInstance.post(`delete-attenance/${classId}/${getFormattedSelectedDate()}`)
            .then(response => {
                console.log(response.data)
            })
            .finally(() => {
                getStudents()
                getClassAttendanceStatusCount()
            })
    };

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 place-items-center'>
            <div className='w-full h-full flex justify-center'>
                <div className="text-center p-6 bg-white shadow-light rounded-lg relative md:w-4/5 h-min">
                    {/* This button is use for selecting the date today */}
                    <button
                        disabled={
                            selectedDate?.toDateString() === new Date().toDateString() &&
                            currentDate?.toDateString() === new Date().toDateString()
                        } // Disable if both selectedDate and currentDate are today's date
                        onClick={() => {
                            const today = new Date();
                            setCurrentDate(today); // Update calendar to show current month
                            setSelectedDate(today); // Set selected date to today
                        }}
                        className={`absolute top-2 right-2 px-2 ${selectedDate?.toDateString() === new Date().toDateString() &&
                            currentDate?.toDateString() === new Date().toDateString()
                            ? 'bg-gray-300'
                            : 'bg-blue-500 hover:bg-blue-600'
                            } text-white rounded-sm disabled:cursor-not-allowed disabled:bg-gray-300`}
                    >
                        Today
                    </button>

                    {/* This button is use for gettin the latest status count */}
                    <button
                        onClick={getClassAttendanceStatusCount}
                        className={`absolute top-3 left-3 cursor-pointer`}>
                        <FaArrowRotateRight size={25} className={`text-gray-700 ${dateAttendanceStatusCountLoading && 'animate-spin'}`} />
                    </button>

                    <div className="flex items-center justify-between mb-2">
                        {/* Previous month */}
                        <button
                            onClick={goToPreviousMonth}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <MdOutlineArrowBackIos size={50} className="text-gray-800 transition-all duration-100 hover:bg-gray-200 rounded-md active:scale-110" />
                        </button>
                        {/* Displays the month and the year */}
                        <div className="w-52">
                            <h1 className="text-3xl font-bold text-gray-800">{currentMonth}</h1>
                            <p className="text-xl text-gray-600">{currentYear}</p>
                        </div>
                        {/* Next month */}
                        <button
                            onClick={goToNextMonth}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <MdOutlineArrowForwardIos size={50} className="text-gray-800 transition-all duration-100 hover:bg-gray-200 rounded-md active:scale-110" />
                        </button>
                    </div>

                    <table className="table-fixed text-gray-800 border-collapse border border-gray-300">
                        {/* Days of the Week Header */}
                        <thead>
                            <tr>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                    <th
                                        key={index}
                                        className="w-52 text-center text-md bg-gray-100 border border-gray-300"
                                    >
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Days of the Month */}
                        <tbody>
                            {/* Create weeks with 7 days each */}
                            {Array(Math.ceil((adjustedFirstDay + days.length) / 7))
                                .fill(null)
                                .map((_, weekIndex) => (
                                    <tr key={`week-${weekIndex}`}>
                                        {Array(7)
                                            .fill(null)
                                            .map((_, dayIndex) => {
                                                // Calculate the day number based on the week and day index
                                                const dayNumber = weekIndex * 7 + dayIndex - adjustedFirstDay + 1;

                                                // If the day number is outside the valid range, render an empty cell
                                                if (dayNumber <= 0 || dayNumber > days.length) {
                                                    return <td key={`empty-${weekIndex}-${dayIndex}`} className="w-[14%] border border-gray-300" />;
                                                }

                                                const newDate = new Date(
                                                    currentYear,
                                                    currentDate.getMonth(),
                                                    dayNumber
                                                );
                                                const data = attendanceStatusCount.find(
                                                    (date) =>
                                                        new Date(date.attendance_date).toLocaleDateString() ===
                                                        newDate.toLocaleDateString()
                                                );

                                                return (
                                                    <td
                                                        key={dayNumber}
                                                        className={`w-[14%] min-h-16 text-center text-lg border border-gray-300 cursor-pointer ${isSelected(dayNumber)
                                                            ? 'bg-blue-500 text-white'
                                                            : ' hover:bg-gray-200'
                                                            }`}
                                                        onClick={() => {
                                                            if (!isSelected(dayNumber)) setDay(dayNumber);
                                                        }}
                                                    >
                                                        <p className="text-md">{dayNumber}</p>
                                                        {data ? (
                                                            <div className="flex flex-col h-16">
                                                                {data.present_count > 0 && (
                                                                    <div className="text-xs bg-green-500 rounded-sm w-full">{`P: ${data.present_count}`}</div>
                                                                )}
                                                                {data.late_count > 0 && (
                                                                    <div className="text-xs bg-teal-500 rounded-sm w-full">{`L: ${data.late_count}`}</div>
                                                                )}
                                                                {data.excused_count > 0 && (
                                                                    <div className="text-xs bg-orange-500 rounded-sm w-full">{`E: ${data.excused_count}`}</div>
                                                                )}
                                                                {data.absent_count > 0 && (
                                                                    <div className="text-xs bg-red-500 rounded-sm w-full">{`A: ${data.absent_count}`}</div>
                                                                )}
                                                                {/* Display counts that are 0 */}
                                                                {data.present_count === 0 && (
                                                                    <div className="text-xs rounded-sm w-full text-transparent">.</div>
                                                                )}
                                                                {data.late_count === 0 && (
                                                                    <div className="text-xs rounded-sm w-full text-transparent">.</div>
                                                                )}
                                                                {data.excused_count === 0 && (
                                                                    <div className="text-xs rounded-sm w-full text-transparent">.</div>
                                                                )}
                                                                {data.absent_count === 0 && (
                                                                    <div className="text-xs rounded-sm w-full text-transparent">.</div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="rounded-sm w-full h-16" />
                                                        )}
                                                    </td>
                                                );
                                            })}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='place-self-start w-full md:w-4/5'>
                {attendanceLoading ? (
                    <SkeletonStudentsAttendanceList />
                ) : (
                    <table className="w-full table-auto border-collapse border border-gray bg-white shadow-light">
                        <thead className="bg-white">
                            <tr>
                                <th></th>
                                <tr>
                                    <th className='bg-white'></th>
                                    <th className="text-right bg-white w-full">
                                        {/* Button to show the status options */}
                                            <div className='w-full flex justify-center py-2'>
                                            <div className="relative" ref={dropdownRef}>
                                                <button
                                                    onClick={() => setStatusButtons(!statusButtons)}
                                                    className="border transition-colors duration-100 border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 focus:outline-none rounded-md px-2 py-1 flex gap-1 items-center"
                                                >
                                                    Mark All
                                                    <FaChevronDown />
                                                </button>

                                                {/* Conditional rendering of the status buttons */}
                                                {statusButtons && (
                                                    <div className="absolute -bottom-30 bg-white border rounded-md shadow-lg py-1">
                                                        <button
                                                            onClick={() => markAllStatus('Present')}
                                                            className="block w-full text-left px-4 py-2 text-green-500 hover:bg-green-100"
                                                        >
                                                            Present
                                                        </button>
                                                        <button
                                                            onClick={() => markAllStatus('Absent')}
                                                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                                                        >
                                                            Absent
                                                        </button>
                                                        <button
                                                            onClick={() => markAllStatus('Late')}
                                                            className="block w-full text-left px-4 py-2 text-teal-500 hover:bg-teal-100"
                                                        >
                                                            Late
                                                        </button>
                                                        <button
                                                            onClick={() => markAllStatus('Excused')}
                                                            className="block w-full text-left px-4 py-2 text-orange-500 hover:bg-orange-100"
                                                        >
                                                            Excused
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </tr>
                            <tr>
                                <th className="bg-gray-100 px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                                    Name
                                </th>
                                <th className="bg-gray-100 px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr
                                    key={index}
                                    className="bg-white"
                                >
                                    {/* Name Column */}
                                    <td className="px-4 py-2 text-gray-800 border border-gray-300">
                                        {index + 1}. {formatFullName(student)}
                                    </td>

                                    {/* Status Column */}
                                    <td className="px-4 py-2 text-gray-800 border border-gray-300 w-36">
                                        <select
                                            onChange={(e) => {
                                                statusOnChange(student.student_id, e.target.value, classId, student.id)
                                            }}
                                            value={student.attendance_status || ''}
                                            className={`border-2 
                                                ${student.attendance_status == 'Present' && 'border-green-500 focus:outline-green-500'} 
                                                ${student.attendance_status == 'Absent' && 'border-red-500 focus:outline-red-500'}
                                                ${student.attendance_status == 'Late' && 'border-teal-500 focus:outline-teal-500'}
                                                ${student.attendance_status == 'Excused' && 'border-orange-500 focus:outline-orange-500'}
                                            w-full border-gray-300 rounded-sm px-2 py-1 text-sm text-gray-700 cursor-pointer`}
                                        >
                                            {!student.attendance_status && (
                                                <option value="">Select</option>
                                            )}
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                            <option value="Late">Late</option>
                                            <option value="Excused">Excused</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td className='px-2 py-2 items-center ' colSpan="2">
                                    <div className='w-full flex justify-center'>
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className={`p-2 rounded-md text-sm flex gap-1 items-center focus:outline-none ${students.every(student => student.id === null)
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-red-500 text-white hover:bg-red-600"
                                                }`}
                                            disabled={students.every(student => student.id === null)}
                                        >
                                            <FaTrash />
                                            Delete Attendance
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4 text-center">Confirm Deletion</h2>
                        <p className="text-gray-700 text-center mb-6">
                            Are you sure you want to delete all attendance records for this date?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => {
                                    deleteAttendance();
                                    setIsModalOpen(false); // Close modal after deleting
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TakeAttendance;
