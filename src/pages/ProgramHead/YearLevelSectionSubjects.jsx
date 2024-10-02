import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../../../axios/axiosInstance';
import { convert24HourTimeToMinutes, convertAMPMTo24Hour, convertMinutesTo24HourTime, convertToAMPM, hasTimeConflict } from '../../utilities/utils';

function YearLevelSectionSubjects() {
    const { courseid, yearlevel } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get('section');
    const [submitting, setSubmitting] = useState(false);

    const formattedYearLevel = yearlevel.replace(/-/g, ' ');

    const [yearLevelSectionId, setYearLevelSectionId] = useState(0);

    const [addingSubject, setAddingSubject] = useState(false);

    const [classes, setClasses] = useState([]);
    const [course, setCourse] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [instructors, setInstructors] = useState([]);

    const [facultyName, setFacultyName] = useState('');

    const [classForm, setClassForm] = useState({
        class_code: '',
        subject_id: '',
        day: '',
        start_time: '7:30',
        end_time: '',
        faculty_id: 0,
        room_id: 0,

        descriptive_title: '',
    });

    const [roomClassesTime, setRoomClassesTime] = useState([]);
    const [instructorClassesTimes, setInstructorClassesTimes] = useState([]);

    const getRoomClassesTime = async (roomId, day) => {
        const id = roomId || classForm.room_id;
        const dayName = day || classForm.day;
        await axiosInstance.get(`get-room-time/${id}/${dayName}`)
            .then(response => {
                setRoomClassesTime(response.data);
            })
    };

    const getInstructorClassesTime = async (instructorId, day) => {
        const dayName = day || classForm.day;
        const id = instructorId || classForm.faculty_id;
        await axiosInstance.get(`get-instructor-time/${id}/${dayName}`)
            .then(response => {
                setInstructorClassesTimes(response.data);
                console.log(response.data);
            })
    };


    const handleClassFormChange = (e) => {
        const { name, value } = e.target;

        setClassForm(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'day') {
            if (classForm.room_id !== 0) [
                getRoomClassesTime(undefined, value)
            ]
            if (classForm.faculty_id !== 0) [
                getInstructorClassesTime(undefined, value)
            ]
        } else if (name === 'room_id' && classForm.day !== '') {
            getRoomClassesTime(value)
        }
    };

    const [startTime, setStartTime] = useState({
        hours: '7',
        minutes: '00',
        time_indicator: 'AM',
        end: 180,
    });

    const startTimeChange = (e) => {
        const { name, value } = e.target;

        setClassForm(prev => {
            const updatedTime = {
                hours: name === 'hours' ? value : startTime.hours,
                minutes: name === 'minutes' ? value : startTime.minutes,
                time_indicator: name === 'time_indicator' ? value : startTime.time_indicator,
            };

            if (name === 'time_indicator') {
                if (value === "AM") {
                    setStartTime({
                        ...startTime,
                        hours: '7',
                        minutes: '30',
                        time_indicator: 'AM',
                    })
                    return {
                        ...prev,
                        start_time: convertAMPMTo24Hour(
                            `7:30 AM`
                        )
                    };
                } else if (value === "PM") {
                    setStartTime({
                        ...startTime,
                        hours: '12',
                        minutes: '00',
                        time_indicator: 'PM',
                    })
                    return {
                        ...prev,
                        start_time: convertAMPMTo24Hour(
                            `12:00 PM`
                        )
                    };
                }
            }

            return {
                ...prev,
                start_time: convertAMPMTo24Hour(
                    `${updatedTime.hours}:${updatedTime.minutes} ${updatedTime.time_indicator}`
                )
            };
        });

        setStartTime(prev =>
        ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        setClassForm(prev => ({
            ...prev,
            end_time: convertMinutesTo24HourTime(Number(convert24HourTimeToMinutes(classForm.start_time)) + Number(startTime.end))
        }))
    }, [classForm.start_time, startTime.end])

    const subjectCodeExist = (subjectCode) => {
        const subject = subjects.find(subject => subject.subject_code === subjectCode);
        if (subject) {
            setClassForm(prev => ({
                ...prev,
                subject_code: subject.subject_code,
                subject_id: subject.id,
                descriptive_title: subject.descriptive_title,
            }));
        } else {
            setClassForm(prev => ({
                ...prev,
                subject_id: '',
                descriptive_title: '',
            }));
        }
    };

    const [typingTimeout, setTypingTimeout] = useState(null);

    const handleSubectCodeChange = (e) => {
        setClassForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value.toUpperCase()
        }))

        if (e.target.name === 'subject_code') {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            const newTimeout = setTimeout(() => {
                subjectCodeExist(e.target.value)
            }, 1000);

            setTypingTimeout(newTimeout);
        }
    }

    const getClasses = async () => {
        await axiosInstance.get(`get-classes/${courseid}/${formattedYearLevel}/${section}`)
            .then(response => {
                setClasses(response.data.classes);
                console.log(response.data.classes);
                setYearLevelSectionId(response.data.yearSectionId);
            })
    }

    useEffect(() => {

        const getCourseName = async () => {
            await axiosInstance.get(`get-course-name/${courseid}`)
                .then(response => {
                    setCourse(response.data);
                });
        };

        const getSubjects = async () => {
            await axiosInstance.get(`get-subjects`)
                .then(response => {
                    setSubjects(response.data)
                })
        }

        const getDeptRooms = async () => {
            await axiosInstance.get(`get-department-rooms`)
                .then(response => {
                    setRooms(response.data)
                })
        }

        const getInstructors = async () => {
            await axiosInstance.get(`get-instructors`)
                .then(response => {
                    setInstructors(response.data)
                })
        }

        getClasses()
        getCourseName()
        getSubjects()
        getDeptRooms()
        getInstructors()
    }, [courseid]);

    const [isActive, setIsActive] = useState(false);

    const handleFocus = () => {
        setIsActive(true);
    };

    const handleBlur = () => {
        setIsActive(false);
    };

    const [instructorInFocus, setInstructorInFocus] = useState(false);

    const handleInstructorFocus = () => {
        setInstructorInFocus(true);
    };

    const handleInstructorBlur = () => {
        setInstructorInFocus(false);
        if (facultyName == "") [
            setClassForm(prev => ({
                ...prev,
                faculty_id: 0
            }))
        ]
    };

    useEffect(() => {
        if (classForm.faculty_id != 0) {
            const instructor = instructors.find(instructor => instructor.id === classForm.faculty_id);
            setFacultyName(instructor.first_name + ',' + ' ' + instructor.last_name);
        } else[
            setFacultyName("")
        ]
    }, [classForm.faculty_id, instructorInFocus])


    const [classInvalidFields, setClassInvalidFields] = useState([""]);
    const submitClass = async () => {
        setSubmitting(true)
        const invalidFields = [];

        if (!classForm.class_code) invalidFields.push('class_code');
        if (!classForm.subject_id) invalidFields.push('subject_id');
        if (!classForm.day) invalidFields.push('day');
        if (!classForm.start_time) invalidFields.push('start_time');
        if (!classForm.end_time) invalidFields.push('end_time');
        if (classForm.faculty_id === 0) invalidFields.push('faculty_id');
        if (classForm.room_id === 0) invalidFields.push('room_id');

        setClassInvalidFields(invalidFields);

        if (invalidFields.length > 0) {
            setSubmitting(false);
            return;
        }
        await axiosInstance.post(`add-class/${yearLevelSectionId}`, classForm)
            .then(response => {
                if (response.data.message === 'success') {
                    getClasses();
                    setAddingSubject(false)
                    setClassForm({
                        class_code: '',
                        subject_id: '',
                        day: '',
                        start_time: '7:00',
                        end_time: '',
                        faculty_id: 0,
                        room_id: 0,

                        descriptive_title: '',
                    });
                    setInstructorClassesTimes([]);
                    setRoomClassesTime([]);
                }
            })
            .finally(() => {
                setSubmitting(false)
            })
    };

    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow overflow-hidden mb-6 text-center">
                {course.course_name &&
                    <>
                        <h1 className="text-4xl font-bold text-blue-600">
                            {course.course_name_abbreviation} -
                            {yearlevel === 'First-Year' ? '1' :
                                yearlevel === 'Second-Year' ? '2' :
                                    yearlevel === 'Third-Year' ? '3' :
                                        yearlevel === 'Fourth-Year' ? '4' : ''}{section}

                        </h1>
                    </>
                }
            </div>
            <table className="min-w-full bg-white mb-4">
                <thead>
                    <tr className="w-full bg-[#00b6cf] text-white text-left">
                        <th className="py-2 px-1">Class Code</th>
                        <th className="py-2 px-1">Subject Code</th>
                        <th className="py-2 px-1">Descriptive Title</th>
                        <th className="py-2 px-1">Day</th>
                        <th className="py-2 px-1">Time</th>
                        <th className="py-2 px-1">Room</th>
                        <th className="py-2 px-1">Instructor</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.length > 0 ? (
                        classes.map((classSubject, index) => (
                            <tr
                                key={index}
                                className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-[#deeced]"}`}
                            >
                                <td className="py-2 px-1">
                                    {classSubject.class_code}
                                </td>
                                <td className="py-2 px-1">
                                    {classSubject.subject_code}
                                </td>
                                <td className="py-2 px-1 truncate max-w-xs overflow-hidden whitespace-nowrap">
                                    {classSubject.descriptive_title}
                                </td>
                                <td className="py-2 px-1">
                                    {classSubject.day}
                                </td>
                                <td
                                    className={`py-2 px-1 ${hasTimeConflict(
                                        convert24HourTimeToMinutes(classSubject.start_time),
                                        convert24HourTimeToMinutes(classSubject.end_time),
                                        convert24HourTimeToMinutes(classForm.start_time),
                                        convert24HourTimeToMinutes(classForm.end_time)
                                    ) &&
                                        classSubject.room_id &&
                                        classForm.day.toUpperCase() === classSubject.day.toUpperCase() &&
                                        addingSubject
                                        ? 'bg-red-500 text-white font-semibold'
                                        : ''
                                        }`}
                                >
                                    {`${convertToAMPM(classSubject.start_time)} - ${convertToAMPM(classSubject.end_time)}`}
                                </td>
                                <td className="py-2 px-1">
                                    {`${classSubject.room_name}`}
                                </td>
                                <td className="py-2 px-1 truncate max-w-xs overflow-hidden whitespace-nowrap">
                                    {`${classSubject.last_name}, ${classSubject.first_name}`}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="py-2 px-4" colSpan="6">
                                No Data
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {addingSubject &&
                <div className="mb-4 py-2 px-4 bg-white rounded-lg shadow-md">
                    <div className="grid grid-cols-9 gap-4 text-sm">
                        <div className='col-span-1'>
                            <label htmlFor="descriptive_title" className="truncate">Class Code</label>
                            <input
                                value={classForm.class_code}
                                onChange={handleClassFormChange}
                                name='class_code'
                                type="text"
                                className={`h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('class_code') && 'border-red-300'}`}
                            />
                        </div>
                        <div className="relative col-span-1">
                            <label htmlFor="descriptive_title" className="truncate">Subject Code</label>
                            <input
                                value={classForm.subject_code}
                                onChange={handleSubectCodeChange}
                                name='subject_code'
                                type="text"
                                className={`h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('subject_id') && 'border-red-300'}`}
                            />

                            {classForm.subject_code && (!classForm.subject_id) && (
                                <div className="absolute left-0 right-0 bg-gray-100 max-h-32 overflow-y-auto z-10 mt-1">
                                    {subjects
                                        .filter(subject =>
                                            subject.subject_code.toUpperCase().includes(classForm.subject_code.toUpperCase())
                                        )
                                        .map((subject, index) => (
                                            <div
                                                key={index}
                                                className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                                                onClick={() => {
                                                    setClassForm(prev => ({
                                                        ...prev,
                                                        subject_id: subject.id,
                                                        subject_code: subject.subject_code,
                                                        descriptive_title: subject.descriptive_title,
                                                    }))
                                                }}
                                            >
                                                {subject.subject_code}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor="descriptive_title" className="truncate">Descriptive Title</label>
                            <input
                                readOnly={true}
                                value={classForm.descriptive_title}
                                onChange={handleClassFormChange}
                                name='descriptive_title'
                                type="text"
                                className={`h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('subject_id') && 'border-red-300'}`}
                            />
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor="day" className="truncate">Day</label>
                            <select
                                value={classForm.day}
                                onChange={handleClassFormChange}
                                name='day'
                                className={`h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('day') && 'border-red-300'}`}
                            >
                                <option value="" disabled>...</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                            </select>
                        </div>

                        <div className='col-span-2'>
                            <label htmlFor="day" className="truncate">Start Time</label>
                            <div className='flex items-center gap-1'>
                                <select
                                    style={{ WebkitAppearance: 'none' }}
                                    value={startTime.hours}
                                    onChange={startTimeChange}
                                    name='hours'
                                    className={`text-center h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 0 ${classInvalidFields.includes('start_time') && 'border-red-300'}`}
                                >
                                    <option value="" disabled>...</option>
                                    {startTime.time_indicator === 'PM' &&
                                        <>
                                            <option value="12">12</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </>
                                    }
                                    {startTime.time_indicator === 'AM' &&
                                        <>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                        </>
                                    }
                                </select>
                                :
                                <select
                                    style={{ WebkitAppearance: 'none' }}
                                    value={startTime.minutes}
                                    onChange={startTimeChange}
                                    name='minutes'
                                    className={`text-center h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('start_time') && 'border-red-300'}`}
                                >
                                    {startTime.hours !== '7' &&
                                        <option value="00">00</option>
                                    }
                                    <option value="30">30</option>
                                </select>
                                <select
                                    style={{ WebkitAppearance: 'none' }}
                                    value={startTime.time_indicator}
                                    onChange={startTimeChange}
                                    name='time_indicator'
                                    className={`text-center h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('start_time') && 'border-red-300'}`}
                                >
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor="descriptive_title" className="truncate">End Time</label>
                            <div className="relative col-span-1">
                                <input
                                    readOnly={true}
                                    value={convertToAMPM(classForm.end_time)}
                                    onFocus={handleFocus}
                                    onBlur={() => setTimeout(handleBlur, 100)}
                                    name='end_time'
                                    type="text"
                                    className={`h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('end_time') && 'border-red-300'}`}
                                />
                                {isActive && (
                                    <div className="absolute left-0 right-0 bg-gray-100 max-h-32 overflow-y-auto z-10 mt-1">
                                        <div
                                            onMouseDown={() => setStartTime(prev => ({ ...prev, end: 120 }))}
                                            className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                                        >
                                            +2hrs
                                        </div>
                                        <div
                                            onMouseDown={() => setStartTime(prev => ({ ...prev, end: 180 }))}
                                            className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                                        >
                                            +3hrs
                                        </div>
                                        <div
                                            onMouseDown={() => setStartTime(prev => ({ ...prev, end: 300 }))}
                                            className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                                        >
                                            +5hrs
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor="descriptive_title" className="truncate">Room</label>
                            <select
                                value={classForm.room_id}
                                onChange={handleClassFormChange}
                                name='room_id'
                                type="text"
                                className={`h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('room_id') && 'border-red-300'}`}
                            >
                                <option disabled value="0">...</option>
                                {rooms.map((room, index) => (
                                    <option key={index} value={room.id}>{room.room_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='relative col-span-1'>
                            <label htmlFor="faculty_id" className="truncate">Instructor</label>
                            <input
                                value={facultyName}
                                onChange={(e) => { setFacultyName(e.target.value) }}
                                name='faculty_id'
                                type="text"
                                className={`h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('faculty_id') && 'border-red-300'}`}
                                onFocus={handleInstructorFocus}
                                onBlur={() => setTimeout(handleInstructorBlur, 200)}
                            />

                            {instructorInFocus && facultyName && (
                                <div className="w-max absolute right-0 bg-gray-100 max-h-32 overflow-y-auto z-10 mt-1">
                                    {instructors
                                        .filter(instructor =>
                                            (instructor.last_name.toUpperCase() + ',' + ' ' + instructor.first_name.toUpperCase()).includes(facultyName.toUpperCase())
                                        )
                                        .map((instructor, index) => (
                                            <div
                                                key={index}
                                                className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                                                onClick={() => {
                                                    setClassForm(prev => ({
                                                        ...prev,
                                                        faculty_id: instructor.id
                                                    }))
                                                    setFacultyName(instructor.last_name + ',' + ' ' + instructor.first_name)
                                                    if (classForm.day !== '') {
                                                        getInstructorClassesTime(instructor.id)
                                                    }
                                                }}
                                            >
                                                {instructor.last_name}, {instructor.first_name}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }

            <button
                onClick={() => { setAddingSubject(!addingSubject) }}
                className={`${addingSubject ? 'bg-red-500' : 'bg-blue-500'} mr-2 text-white px-4 py-2 rounded hover:bg-opacity-90 transition`}>
                {addingSubject ? (
                    'Cancel'
                ) : (
                    'Add Class'
                )}
            </button>
            {addingSubject &&
                <button
                    disabled={submitting}
                    onClick={submitClass}
                    className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-opacity-90 transition`}>
                    Submit
                </button>
            }
            <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 w-max'>
                {/* Room Schedule */}
                {roomClassesTime && addingSubject && (
                    <div className='w-full md:w-64 bg-white rounded-lg shadow-lg p-4 flex flex-col'>
                        <div className="text-lg font-semibold mb-4 text-gray-800">Room Schedule</div>
                        {roomClassesTime.length > 0 ? (
                            roomClassesTime.map((classTime, index) => (
                                <div key={index} className={`bg-gray-100 rounded-md p-2 shadow-sm my-1
                                ${hasTimeConflict(
                                    convert24HourTimeToMinutes(classTime.start_time),
                                    convert24HourTimeToMinutes(classTime.end_time),
                                    convert24HourTimeToMinutes(classForm.start_time),
                                    convert24HourTimeToMinutes(classForm.end_time)
                                )
                                        ? 'bg-red-500 text-white font-semibold'
                                        : ''
                                    }`}>
                                    {`${convertToAMPM(classTime.start_time)} - ${convertToAMPM(classTime.end_time)}`}
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500">No schedule available</div>
                        )}
                    </div>
                )}

                {/* Instructor Schedule */}
                {instructorClassesTimes && addingSubject && (
                    <div className='w-full md:w-64 bg-white rounded-lg shadow-lg p-4 flex flex-col'>
                        <div className="text-lg font-semibold mb-4 text-gray-800">Instructor Schedule</div>
                        {instructorClassesTimes.length > 0 ? (
                            instructorClassesTimes.map((instructorTime, index) => (
                                <div key={index} className={`bg-gray-100 rounded-md p-2 shadow-sm my-1
                                ${hasTimeConflict(
                                    convert24HourTimeToMinutes(instructorTime.start_time),
                                    convert24HourTimeToMinutes(instructorTime.end_time),
                                    convert24HourTimeToMinutes(classForm.start_time),
                                    convert24HourTimeToMinutes(classForm.end_time)
                                )
                                        ? 'bg-red-500 text-white font-semibold'
                                        : ''
                                    }`}>
                                    {`${convertToAMPM(instructorTime.start_time)} - ${convertToAMPM(instructorTime.end_time)}`}
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500">No schedule available</div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default YearLevelSectionSubjects;