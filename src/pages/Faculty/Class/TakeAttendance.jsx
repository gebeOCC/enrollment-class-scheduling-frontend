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
    // Initialize state for the current date (as a Date object)
    const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize selected date to current date
    const [attendanceLoading, setAttendanceLoading] = useState(true);
    const [dateAttendanceStatusCountLoading, setDateAttendanceStatusCountLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [attendanceStatusCount, setAttendanceStatusCount] = useState([]);

    // Get the current month and year from the Date object
    const currentMonth = selectedDate.toLocaleString('default', { month: 'long' });
    const currentYear = selectedDate.getFullYear();

    // Function to go to the previous month
    const goToPreviousMonth = () => {
        const prevDate = new Date(selectedDate);
        prevDate.setMonth(selectedDate.getMonth() - 1);
        setSelectedDate(prevDate);
    };

    // Function to go to the next month
    const goToNextMonth = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setMonth(selectedDate.getMonth() + 1);
        setSelectedDate(nextDate);
    };

    // Function to set the day with a formatted date
    const setDay = (day) => {
        console.log(day)
        const newDate = new Date(currentYear, selectedDate.getMonth(), day);

        // Format the date to match the local time (without UTC adjustment)
        const formattedDate = newDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format
        getStudentAttendance(formattedDate)

        setSelectedDate(newDate);
    };

    // Function to check if the day is selected
    const isSelected = (day) => {
        if (!selectedDate) return false;
        return selectedDate.getDate() === day;
    };

    // Get the first day of the current month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const firstDayOfMonth = new Date(currentYear, selectedDate.getMonth(), 1).getDay();

    // Adjust to start from Monday (since getDay() returns Sunday as 0)
    const adjustedFirstDay = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);

    // Get the total number of days in the current month
    const totalDaysInMonth = new Date(currentYear, selectedDate.getMonth() + 1, 0).getDate();

    // Array of the days in the current month (1 to 31)
    const days = Array.from({ length: totalDaysInMonth }, (_, index) => index + 1);

    const getFormattedSelectedDate = () => {
        return selectedDate.toLocaleDateString('en-CA');
    }

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

    const markAllPresent = () => {
        students.forEach((student) => {
            statusOnChange(student.student_id, 'Present', classId, student.id);
        });
    };

    // Function to delete attendance (reset status to empty)
    const deleteAttendance = () => {
        students.forEach((student) => {
            statusOnChange(student.student_id, '', classId, student.id);
        });
    };

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

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 place-items-center'>
            <div className='w-full h-full flex justify-center'>
                <div className="text-center p-6 bg-white shadow-light rounded-lg relative md:w-min h-min">
                    {/* This button is use for selecting the date today */}
                    <button
                        disabled={selectedDate?.toDateString() === new Date().toDateString() && selectedDate?.toDateString() === new Date().toDateString()} // Disable if selectedDate or currentDate is today's date
                        onClick={() => { setSelectedDate(new Date()); setSelectedDate(new Date()) }}
                        className={`absolute top-2 right-2 px-2 ${selectedDate?.toDateString() === new Date().toDateString() && selectedDate?.toDateString() === new Date().toDateString() ? 'bg-gray-300' : 'bg-blue-500'} text-white rounded-sm hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300`}>
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

                    {/* Days of the Week Header */}
                    <div className="grid grid-cols-7 text-gray-800 font-semibold">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                            <div key={index} className="text-center text-lg bg-gray-200">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days of the Month */}
                    <div className="grid grid-cols-7 text-gray-800">
                        {/* Empty cells for the first week */}
                        {Array(adjustedFirstDay)
                            .fill(null)
                            .map((_, index) => (
                                <div key={`empty-${index}`} />
                            ))}

                        {/* Filter out Sundays (7th day of the week) */}
                        {days
                            .map((day) => {
                                // Get the actual day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
                                const dayOfWeek = new Date(currentYear, selectedDate.getMonth(), day).getDay();
                                // Only render the day if it's not Sunday (day 0)
                                // if (dayOfWeek === 0) return null;  // Skip rendering for Sundays
                                return (
                                    <div
                                        onClick={() => { if (isSelected(day)) return; setDay(day); }}
                                        key={day}
                                        className={`min-h-16 p-[2px] text-center content-center text-lg border border-gray-300 cursor-pointer ${isSelected(day) ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        {(() => {
                                            const newDate = new Date(currentYear, selectedDate.getMonth(), day);
                                            const data = attendanceStatusCount.find(date => new Date(date.attendance_date).toLocaleDateString() === newDate.toLocaleDateString());

                                            if (!data) return (
                                                <>
                                                    <p className='text-md'>{day}</p>
                                                    <div className='rounded-sm w-full h-16' />
                                                </>
                                            );

                                            return (
                                                <>
                                                    <p className='text-md'>{day}</p>
                                                    <div className='flex flex-col h-16'>
                                                        {data.present_count > 0 && <div className='text-xs bg-green-500 rounded-sm w-full'>{`P: ${data.present_count}`}</div>}
                                                        {data.late_count > 0 && <div className='text-xs bg-teal-500 rounded-sm w-full'>{`L: ${data.late_count}`}</div>}
                                                        {data.excused_count > 0 && <div className='text-xs bg-orange-500 rounded-sm w-full'>{`E: ${data.excused_count}`}</div>}
                                                        {data.absent_count > 0 && <div className='text-xs bg-red-500 rounded-sm w-full'>{`A: ${data.absent_count}`}</div>}
                                                        {/* Display counts that are 0 */}
                                                        {data.present_count === 0 && <div className='text-xs rounded-sm w-full text-transparent'>.</div>}
                                                        {data.late_count === 0 && <div className='text-xs rounded-sm w-full text-transparent'>.</div>}
                                                        {data.excused_count === 0 && <div className='text-xs rounded-sm w-full text-transparent'>.</div>}
                                                        {data.absent_count === 0 && <div className='text-xs rounded-sm w-full text-transparent'>.</div>}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                );
                            })
                            .filter(Boolean)} {/* Filter out nulls (Sundays) */}
                    </div>
                </div>
            </div>

            <div className='place-self-start'>
                {!attendanceLoading ? (
                    <SkeletonStudentsAttendanceList />
                ) : (
                    <div>
                        <table className="min-w-full table-auto border-collapse border border-gray bg-white shadow-light">
                            <thead className="bg-white">
                                <tr>
                                    <th></th>
                                    <tr>
                                        <th className='bg-white'></th>
                                        <th className="text-right bg-white">
                                            {/* Button to show the status options */}
                                            <div className='w-full flex justify-center'>
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
                                        {/* Button to delete all attendance records */}
                                        <div className='w-full flex justify-center'>
                                            <button
                                                onClick={deleteAttendance}
                                                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none text-sm flex gap-1 items-center"
                                            >
                                                <FaTrash />
                                                Delete Attendance
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TakeAttendance;
