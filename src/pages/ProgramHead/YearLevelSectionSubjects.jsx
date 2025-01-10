import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../../../axios/axiosInstance';
import { convert24HourTimeToMinutes, convertAMPMTo24Hour, convertMinutesTo24HourTime, convertToAMPM, formatFullName, hasTimeConflict } from '../../utilities/utils';
import { MdDelete, MdEdit } from 'react-icons/md';
import { ImSpinner5 } from 'react-icons/im';
import { FaPlus } from 'react-icons/fa6';
import Schedule from '../Schedule/Schedule';
import { RiMegaphoneFill, RiMegaphoneLine } from 'react-icons/ri';

function YearLevelSectionSubjects() {
    const { courseid, yearlevel } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get('section');
    const [submitting, setSubmitting] = useState(false);
    const [editClass, setEditClass] = useState(false);
    const [classId, setClassId] = useState(0);
    const [addingSecondarySchedule, setAddingSecondarySchedule] = useState(false);
    const [editingSecondarySchedule, setEditingSecondarySchedule] = useState(false);
    const [plotting, setPlotting] = useState(false);

    const [subjectToDelete, setSubjectToDelete] = useState({
        deleting: false,
        classId: 0,
        secondaSched: false,
    });

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
        end_time: '10:30',
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
        const id = instructorId || classForm.faculty_id;
        const dayName = day || classForm.day;
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

        // Helper function to handle default time for AM and PM
        const handleDefaultTime = (indicator) => {
            const timeMap = {
                AM: { hours: '7', minutes: '30', time_indicator: 'AM' },
                PM: { hours: '12', minutes: '00', time_indicator: 'PM' }
            };
            const defaultTime = timeMap[indicator];

            setStartTime(prev => ({ ...prev, ...defaultTime }));

            return convertAMPMTo24Hour(
                `${defaultTime.hours}:${defaultTime.minutes} ${defaultTime.time_indicator}`
            );
        };

        // Update the correct form based on the edit mode
        const updateForm = editFormUpdater => {
            editFormUpdater(prev => {
                const updatedTime = {
                    hours: name === 'hours' ? value : startTime.hours,
                    minutes: name === 'minutes' ? value : startTime.minutes,
                    time_indicator: name === 'time_indicator' ? value : startTime.time_indicator,
                };

                // Handle default AM/PM setup
                if (name === 'time_indicator') {
                    return { ...prev, start_time: handleDefaultTime(value) };
                }

                // Update with current input values
                return {
                    ...prev,
                    start_time: convertAMPMTo24Hour(
                        `${updatedTime.hours}:${updatedTime.minutes} ${updatedTime.time_indicator}`
                    )
                };
            });
        };

        updateForm(setClassForm);
        setStartTime(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (classForm.start_time != "TBA") {
            setClassForm(prev => ({
                ...prev,
                end_time: convertMinutesTo24HourTime(Number(convert24HourTimeToMinutes(classForm.start_time)) + Number(startTime.end))
            }))
        } else {
            setClassForm(prev => ({
                ...prev,
                end_time: "TBA"
            }))
        }
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

    // api to fetch all the classes of this year level & section
    const getClasses = async () => {
        await axiosInstance.get(`get-classes/${courseid}/${formattedYearLevel}/${section}`)
            .then(response => {
                setClasses(response.data.classes);
                console.log(response.data.classes)
                setYearLevelSectionId(response.data.yearSectionId);
            })
    }

    const getSubjects = async () => {
        if (subjects.length > 0) return
        await axiosInstance.get(`get-subjects`)
            .then(response => {
                setSubjects(response.data)
            })
    }

    const getDeptRooms = async () => {
        if (rooms.length > 0) return
        await axiosInstance.get(`get-department-rooms`)
            .then(response => {
                setRooms(response.data)
            })
    }

    const getInstructors = async () => {
        if (instructors.length > 0) return
        await axiosInstance.get(`get-instructors`)
            .then(response => {
                setInstructors(response.data);
            })
    }

    useEffect(() => {
        const getCourseName = async () => {
            await axiosInstance.get(`get-course-name/${courseid}`)
                .then(response => {
                    setCourse(response.data);
                });
        };

        getClasses()
        getCourseName()
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
        if (classForm.faculty_id == null) {
            setFacultyName("TBA");
        } else if (classForm.faculty_id != 0) {
            const instructor = instructors.find(instructor => instructor.id === classForm.faculty_id);
            setFacultyName(instructor.last_name + ', ' + instructor.first_name);
        } else {
            setFacultyName("")
        }

    }, [classForm.faculty_id, instructorInFocus])

    const getRowClass = (classSubject, classForm, secondarySchedule) => {
        const isTimeConflict = hasTimeConflict(
            convert24HourTimeToMinutes(classSubject.start_time),
            convert24HourTimeToMinutes(classSubject.end_time),
            convert24HourTimeToMinutes(classForm.start_time),
            convert24HourTimeToMinutes(classForm.end_time)
        ) && classForm.day.toUpperCase() === classSubject.day.toUpperCase();

        if (secondarySchedule && editingSecondarySchedule) return 'bg-green-400 text-white font-semibold';
        if (classSubject.id == classId && editClass && !editingSecondarySchedule) return 'bg-green-400 text-white font-semibold';
        if (isTimeConflict) return 'bg-red-500 text-white font-semibold';

        return `odd:bg-white even:bg-gray-100 hover:bg-cyan-200`
    };

    const addEditClass = async (url) => {
        await axiosInstance.post(url, classForm)
            .then(response => {
                if (response.data.message === 'success') {
                    getClasses();
                    setAddingSubject(false)
                    setInstructorClassesTimes([]);
                    setRoomClassesTime([]);
                    setAddingSecondarySchedule(false)
                    setEditingSecondarySchedule(false);
                    setEditClass(false);
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
                }
            })
            .finally(() => {
                setSubmitting(false);
            })
    }

    const [classInvalidFields, setClassInvalidFields] = useState([""]);
    const submit = async () => {
        console.log(classForm)
        // return
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

        if (addingSubject) {
            addEditClass(`add-class/${yearLevelSectionId}`);
        } else if (addingSecondarySchedule) {
            addEditClass(`add-secondary-class/${classId}`);
        } else if (editingSecondarySchedule) {
            addEditClass(`update-secondary-class`);
        } else if (editClass) {
            addEditClass(`update-class/`);
        }
    };

    const handleDelete = async (url) => {
        setSubmitting(true);
        await axiosInstance.post(url, { id: subjectToDelete.classId })
            .then(response => {
                if (response.data.message === 'success') {
                    getClasses();
                    setSubjectToDelete({
                        deleting: false,
                        classId: 0,
                        secondaSched: false,
                    });
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const deleteClass = () => {
        if (subjectToDelete.secondaSched) {
            handleDelete('delete-secondary-class');
        } else {
            handleDelete('delete-class');
        }
    };

    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow overflow-hidden mb-6 text-center">
                {course.course_name &&
                    <>
                        <h1 className="text-4xl font-bold text-blue-600"
                            onClick={() => console.log(classForm)}>
                            {course.course_name_abbreviation} -
                            {yearlevel === 'First-Year' ? ' 1' :
                                yearlevel === 'Second-Year' ? ' 2' :
                                    yearlevel === 'Third-Year' ? ' 3' :
                                        yearlevel === 'Fourth-Year' ? ' 4' : ''}{section}

                        </h1>
                    </>
                }
            </div>
            <div className='bg-white px-4 py-2 w-max rounded-md mb-2 flex items-center gap-3 shadow-md border border-gray-300 hover:shadow-lg transition-all duration-200'>
                <label htmlFor="time-table" className='cursor-pointer text-gray-700 font-medium'>
                    Time Table
                </label>
                <input
                    id="time-table"
                    type="checkbox"
                    checked={plotting}
                    onChange={(e) => setPlotting(e.target.checked)}
                    className='cursor-pointer h-5 w-5 accent-blue-500'
                />
            </div>

            {plotting && <Schedule data={classes} />}

            {!plotting &&
                <>
                    <table className="min-w-full bg-white mb-4 shadow-md">
                        <thead>
                            <tr className="w-full bg-cyan-500 text-white text-left">
                                <th className="py-2 px-1">Class Code</th>
                                <th className="py-2 px-1">Subject Code</th>
                                <th className="py-2 px-1">Descriptive Title</th>
                                <th className="py-2 px-1">Day</th>
                                <th className="py-2 px-1">Time</th>
                                <th className="py-2 px-1">Room</th>
                                <th className="py-2 px-1">Instructor</th>
                                <th className="py-2 px-1"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.length > 0 ? (
                                classes.map((classSubject) => {

                                    const handleEditClass = (classSubject, secondarySchedule) => {
                                        setClassId(classSubject.id);
                                        setEditClass(true);
                                        setClassForm({
                                            id: secondarySchedule ? classSubject.subject_secondary_schedule.id : classSubject.id,
                                            class_code: classSubject.class_code,
                                            subject_code: classSubject.subject_code,
                                            subject_id: classSubject.subject_id,
                                            day: secondarySchedule ? classSubject.subject_secondary_schedule.day : classSubject.day,
                                            start_time: secondarySchedule ? classSubject.subject_secondary_schedule.start_time : classSubject.start_time,
                                            end_time: secondarySchedule ? classSubject.subject_secondary_schedule.end_time : classSubject.end_time,
                                            faculty_id: classSubject.faculty_id,
                                            room_id: secondarySchedule ? classSubject.subject_secondary_schedule.room_id : classSubject.room_id,
                                            descriptive_title: classSubject.descriptive_title,
                                        });
                                        const [timePart, timeIndicator] = convertToAMPM(secondarySchedule ? classSubject.subject_secondary_schedule.start_time : classSubject.start_time).split(' ');
                                        const [hours, minutes] = timePart.split(':');
                                        const end = convert24HourTimeToMinutes(secondarySchedule ? classSubject.subject_secondary_schedule.end_time : classSubject.end_time) - convert24HourTimeToMinutes(secondarySchedule ? classSubject.subject_secondary_schedule.start_time : classSubject.start_time);

                                        setStartTime({
                                            hours,
                                            minutes,
                                            time_indicator: timeIndicator,
                                            end,
                                        });

                                        getRoomClassesTime(secondarySchedule ? classSubject.subject_secondary_schedule.room_id : classSubject.room_id, secondarySchedule ? classSubject.subject_secondary_schedule.day : classSubject.day);
                                        getInstructorClassesTime(classSubject.faculty_id, secondarySchedule ? classSubject.subject_secondary_schedule.day : classSubject.day);
                                    };

                                    return (
                                        <React.Fragment key={classSubject.id + classSubject.class_code}>
                                            <tr
                                                className={`border-b ${getRowClass(classSubject, classForm, false)}`}
                                            >
                                                <>
                                                    <td className={`py-2 px-1`}>
                                                        {classSubject.class_code}
                                                    </td>
                                                    <td className={`py-2 px-1`}>
                                                        {classSubject.subject_code}
                                                    </td>
                                                    <td className={`py-2 px-1 truncate max-w-xs overflow-hidden whitespace-nowrap`}>
                                                        {classSubject.descriptive_title}
                                                    </td>
                                                    <td className={`py-2 px-1`}>
                                                        {classSubject.day}
                                                    </td>
                                                    <td className="py-2 px-1 text-center">
                                                        {classSubject.start_time !== "TBA"
                                                            ? convertToAMPM(classSubject.start_time) + ' - ' + convertToAMPM(classSubject.end_time)
                                                            : "TBA"}
                                                    </td>
                                                    <td className={`py-2 px-1`}>
                                                        {classSubject.room_name != null ? (
                                                            classSubject.room_name
                                                        ) : (
                                                            <>TBA</>
                                                        )}
                                                    </td>
                                                    <td className={`py-2 px-1 truncate max-w-xs overflow-hidden whitespace-nowrap`}>
                                                        {classSubject.first_name != null ? (
                                                            <>{formatFullName(classSubject)}</>
                                                        ) : (
                                                            <>TBA</>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {(!editClass && !addingSubject && !addingSecondarySchedule) && (
                                                            <div className="h-full w-full flex justify-end items-center cursor-pointer">
                                                                {classSubject.laboratory_hours && !classSubject.subject_secondary_schedule && (
                                                                    <FaPlus
                                                                        onClick={() => {
                                                                            if (submitting) return
                                                                            setClassId(classSubject.id);
                                                                            setAddingSecondarySchedule(true);
                                                                            setClassForm({
                                                                                ...classForm,
                                                                                class_code: classSubject.class_code,
                                                                                descriptive_title: classSubject.descriptive_title,
                                                                                subject_code: classSubject.subject_code,
                                                                                faculty_id: classSubject.faculty_id,
                                                                                subject_id: classSubject.subject_id,
                                                                            });
                                                                        }}
                                                                        className="text-blue-500 cursor-pointer"
                                                                    />
                                                                )}
                                                                <MdEdit
                                                                    className="text-green-500 cursor-pointer"
                                                                    onClick={() => {
                                                                        if (submitting) return
                                                                        handleEditClass(classSubject, false)
                                                                    }}
                                                                />
                                                                <MdDelete
                                                                    onClick={() => {
                                                                        if (submitting) return
                                                                        setSubjectToDelete({
                                                                            deleting: true,
                                                                            classId: classSubject.id,
                                                                            secondaSched: false,
                                                                        });
                                                                    }}
                                                                    className="text-red-500 cursor-pointer"
                                                                />
                                                            </div>
                                                        )}
                                                    </td>
                                                </>
                                            </tr>

                                            {classSubject.subject_secondary_schedule && (
                                                <tr
                                                    className={`border-b ${getRowClass(classSubject.subject_secondary_schedule, classForm, true)}`}
                                                >
                                                    <>
                                                        <td className={`py-2 px-1`}>
                                                            {classSubject.class_code}
                                                        </td>
                                                        <td className={`py-2 px-1`}>
                                                            {classSubject.subject_code}
                                                        </td>
                                                        <td className={`py-2 px-1 truncate max-w-xs overflow-hidden whitespace-nowrap`}>
                                                            {classSubject.descriptive_title}
                                                        </td>
                                                        <td className={`py-2 px-1`}>
                                                            {classSubject.subject_secondary_schedule.day}
                                                        </td>
                                                        <td className={`py-2 px-1 text-center`}>
                                                            {classSubject.subject_secondary_schedule.start_time !== "TBA"
                                                                ? convertToAMPM(classSubject.subject_secondary_schedule.start_time) + " - " + convertToAMPM(classSubject.subject_secondary_schedule.end_time)
                                                                : "TBA"}
                                                        </td>
                                                        <td className={`py-2 px-1`}>
                                                            {classSubject.subject_secondary_schedule.room_name != null ? (
                                                                classSubject.subject_secondary_schedule.room_name
                                                            ) : (
                                                                <>TBA</>
                                                            )}
                                                        </td>
                                                        <td className={`py-2 px-1 truncate max-w-xs overflow-hidden whitespace-nowrap`}>
                                                            {classSubject.first_name != null ? (
                                                                <>{formatFullName(classSubject)}</>
                                                            ) : (
                                                                <>TBA</>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {(!editClass && !addingSubject && !addingSecondarySchedule) && (
                                                                <div className="h-full w-full flex justify-end items-center">
                                                                    <MdEdit
                                                                        className="text-green-500 cursor-pointer"
                                                                        onClick={() => {
                                                                            if (submitting) return
                                                                            setEditingSecondarySchedule(true)
                                                                            handleEditClass(classSubject, true)
                                                                        }}
                                                                    />
                                                                    <MdDelete
                                                                        onClick={() => {
                                                                            if (submitting) return
                                                                            setSubjectToDelete({
                                                                                deleting: true,
                                                                                classId: classSubject.subject_secondary_schedule.id,
                                                                                secondaSched: true,
                                                                            });
                                                                        }}
                                                                        className={`text-red-500 cursor-pointer`}
                                                                    />
                                                                </div>
                                                            )}
                                                        </td>
                                                    </>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td className="py-2 px-4" colSpan="6">
                                        No Data
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table >
                    {(addingSubject || addingSecondarySchedule || editClass) &&
                        <div className="mb-4 p-2 bg-white rounded-lg shadow-light space-y-2">
                            <div className='text-2xl font-semibold bg-white max-w-max text-blue-500 rounded-md px-2'>
                                {addingSubject && 'Adding'}
                                {editClass && 'Editing Class'}
                                {addingSecondarySchedule && 'Adding Secondary Schedule'}
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="space-y-2 p-2 rounded-md border shadow-md">
                                    <div className='border-b border-black text-xl font-semibold'>
                                        Class info
                                    </div>
                                    <div className=''>
                                        <label htmlFor="descriptive_title" className="truncate">Class Code:</label>
                                        <input
                                            disabled={addingSecondarySchedule || editingSecondarySchedule}
                                            value={classForm.class_code}
                                            onChange={handleClassFormChange}
                                            name='class_code'
                                            type="text"
                                            className={`h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('class_code') && 'border-red-300'}`}
                                        />
                                    </div>
                                    <div className="relative">
                                        <label htmlFor="descriptive_title" className="truncate">Subject Code:</label>
                                        <input
                                            disabled={addingSecondarySchedule || editingSecondarySchedule}
                                            value={classForm.subject_code}
                                            onChange={handleSubectCodeChange}
                                            name='subject_code'
                                            type="text"
                                            className={`h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('subject_id') && 'border-red-300'}`}
                                        />

                                        {(classForm.subject_code && (!classForm.subject_id) && !addingSecondarySchedule) && (
                                            <div className="absolute left-0 right-0 border bg-white max-h-32 overflow-y-auto z-10 shadow-heavy">
                                                {subjects
                                                    .filter(subject =>
                                                        subject.subject_code.toUpperCase().includes(classForm.subject_code.toUpperCase())
                                                    )
                                                    .map((subject, index) => (
                                                        <div
                                                            key={subject.subject_code}
                                                            className="px-2 py-1 hover:bg-blue-400 cursor-pointer"
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
                                    <div className=''>
                                        <label htmlFor="descriptive_title" className="truncate">Descriptive Title:</label>
                                        <input
                                            disabled={true}
                                            value={classForm.descriptive_title}
                                            onChange={handleClassFormChange}
                                            name='descriptive_title'
                                            type="text"
                                            className={`h-8 w-full px-2 py-1 bg-white border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('subject_id') && 'border-red-300'}`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 p-2 rounded-md border shadow-md">
                                    <div className='border-b border-black text-xl font-semibold'>
                                        Schedule
                                    </div>
                                    <div className='col-span-1'>
                                        <div className='flex justify-between'>
                                            <label htmlFor="day" className="truncate">Day</label>
                                            {classForm.day != "TBA" ? (
                                                <RiMegaphoneLine
                                                    onClick={() => {
                                                        setClassForm(prev => ({
                                                            ...prev,
                                                            day: "TBA",
                                                        }))
                                                    }}
                                                    size={20}
                                                    className='text-gray-800 cursor-pointer' />
                                            ) : (
                                                <RiMegaphoneFill
                                                    onClick={() => {
                                                        setClassForm(prev => ({
                                                            ...prev,
                                                            day: "Monday",
                                                        }))
                                                    }}
                                                    size={20}
                                                    className='text-green-500 cursor-pointer' />
                                            )}
                                        </div>

                                        {classForm.day != "TBA" ? (
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
                                        ) : (
                                            <select
                                                disabled={true}
                                                value={"TBA"}
                                                className={`h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('day') && 'border-red-300'}`}
                                            >
                                                <option value="TBA">TBA</option>
                                            </select>
                                        )}
                                    </div>

                                    <div className='col-span-2'>
                                        <div className='flex justify-between'>
                                            <label htmlFor="day" className="truncate">Start Time:</label>
                                            {classForm.start_time != "TBA" ? (
                                                <RiMegaphoneLine
                                                    onClick={() => {
                                                        setClassForm(prev => ({
                                                            ...prev,
                                                            start_time: "TBA",
                                                        }))
                                                    }}
                                                    size={20}
                                                    className='text-gray-800 cursor-pointer' />
                                            ) : (
                                                <RiMegaphoneFill
                                                    onClick={() => {
                                                        setClassForm(prev => ({
                                                            ...prev,
                                                            start_time: "7:30",
                                                            end_time: "10:30",
                                                        }))

                                                        setStartTime({
                                                            hours: '7',
                                                            minutes: '00',
                                                            time_indicator: 'AM',
                                                            end: 180,
                                                        });

                                                    }}
                                                    size={20}
                                                    className='text-green-500 cursor-pointer' />
                                            )}
                                        </div>
                                        {classForm.start_time != "TBA" ? (
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
                                                    // style={{ WebkitAppearance: 'none' }}
                                                    value={startTime.time_indicator}
                                                    onChange={startTimeChange}
                                                    name='time_indicator'
                                                    className={`text-center h-8 px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('start_time') && 'border-red-300'}`}
                                                >
                                                    <option value="AM">AM</option>
                                                    <option value="PM">PM</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <p className='px-4 py-1 border'>TBA</p>
                                        )}

                                    </div>
                                    <div className='col-span-1'>
                                        <label htmlFor="descriptive_title" className="truncate">End Time:</label>
                                        {classForm.start_time != "TBA" ? (
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
                                                    <div className="absolute left-0 right-0 bg-white rounded-md shadow-2xl border-2 border-gray-400 max-h-32 overflow-y-auto z-10">
                                                        <div
                                                            onMouseDown={() => setStartTime(prev => ({ ...prev, end: 120 }))}
                                                            className="px-2 py-1 hover:bg-blue-400 cursor-pointer"
                                                        >
                                                            +2hrs
                                                        </div>
                                                        <div
                                                            onMouseDown={() => setStartTime(prev => ({ ...prev, end: 180 }))}
                                                            className="px-2 py-1 hover:bg-blue-400 cursor-pointer"
                                                        >
                                                            +3hrs
                                                        </div>
                                                        <div
                                                            onMouseDown={() => setStartTime(prev => ({ ...prev, end: 300 }))}
                                                            className="px-2 py-1 hover:bg-blue-400 cursor-pointer"
                                                        >
                                                            +5hrs
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className='px-4 py-1 border'>TBA</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 p-2 rounded-md border shadow-md">
                                    <div className='border-b border-black text-xl font-semibold'>
                                        Assign
                                    </div>
                                    <div className=''>
                                        <div className='flex justify-between'>
                                            <label htmlFor="room_id" className="truncate">Room:</label>
                                            {classForm.room_id != null ? (
                                                <RiMegaphoneLine
                                                    onClick={() => {
                                                        setClassForm(prev => ({
                                                            ...prev,
                                                            room_id: null,
                                                        }))
                                                    }}
                                                    size={20}
                                                    className='text-gray-800 cursor-pointer' />
                                            ) : (
                                                <RiMegaphoneFill
                                                    onClick={() => {
                                                        setClassForm(prev => ({
                                                            ...prev,
                                                            room_id: 0,
                                                        }))
                                                    }}
                                                    size={20}
                                                    className='text-green-500 cursor-pointer' />
                                            )}
                                        </div>
                                        {classForm.room_id != null ? (
                                            <select
                                                value={classForm.room_id}
                                                onChange={handleClassFormChange}
                                                name='room_id'
                                                type="text"
                                                className={`h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('room_id') && 'border-red-300'}`}
                                            >
                                                <option disabled value="0">...</option>
                                                {rooms.map((room, index) => (
                                                    <option key={room.id + room.room_name} value={room.id}>{room.room_name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <select
                                                disabled={true}
                                                value={'TBA'}
                                                type="text"
                                                className={`h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('room_id') && 'border-red-300'}`}
                                            >
                                                <option disabled value="TBA">TBA</option>
                                            </select>
                                        )}
                                    </div>
                                    <div className='relative'>
                                        <div className='flex justify-between'>
                                            <label htmlFor="faculty_id" className="truncate">Instructor:</label>
                                            {(classForm.faculty_id != null) ? (
                                                <>
                                                    {!editingSecondarySchedule ? (
                                                        <RiMegaphoneLine
                                                            onClick={() => {
                                                                setClassForm(prev => ({
                                                                    ...prev,
                                                                    faculty_id: null,
                                                                }))
                                                            }}
                                                            size={20}
                                                            className='text-gray-800 cursor-pointer' />

                                                    ) : (

                                                        <RiMegaphoneFill
                                                            size={20}
                                                            className='text-gray-800' />
                                                    )}
                                                </>
                                            ) : (
                                                <RiMegaphoneFill
                                                    onClick={() => {
                                                        setClassForm(prev => ({
                                                            ...prev,
                                                            faculty_id: 0,
                                                        }))
                                                    }}
                                                    size={20}
                                                    className='text-green-500 cursor-pointer' />
                                            )}
                                        </div>
                                        <input
                                            disabled={addingSecondarySchedule || editingSecondarySchedule}
                                            readOnly={classForm.faculty_id == null}
                                            value={facultyName}
                                            onChange={(e) => {
                                                setFacultyName(e.target.value);
                                                if (e.target.value == "") {
                                                    setClassForm(prev => ({
                                                        ...prev,
                                                        faculty_id: 0
                                                    }));
                                                }
                                            }}
                                            name='faculty_id'
                                            type="text"
                                            className={`h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${classInvalidFields.includes('faculty_id') && 'border-red-300'}`}
                                            onFocus={handleInstructorFocus}
                                            onBlur={() => setTimeout(handleInstructorBlur, 200)}
                                        />

                                        {/* {!facultyName && ( */}
                                        <div className="w-full max-h-16 bg-white overflow-y-auto z-10 border">
                                            {instructors
                                                .filter(instructor =>
                                                    (instructor.last_name.toUpperCase() + ',' + ' ' + instructor.first_name.toUpperCase()).includes(facultyName.toUpperCase())
                                                )
                                                .map((instructor, index) => {

                                                    if (classForm.faculty_id && facultyName.toLocaleUpperCase == formatFullName(instructor).toLocaleUpperCase) return null
                                                    return (
                                                        <div
                                                            key={instructor.id + instructor.first_name}
                                                            className="px-2 py-1 hover:bg-blue-400 cursor-pointer"
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
                                                            {formatFullName(instructor)}
                                                        </div>
                                                    )
                                                })}
                                        </div>
                                        {/* )} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    {
                        addingSubject || addingSecondarySchedule || editClass ?
                            <>
                                < button
                                    onClick={() => {
                                        setClassForm({
                                            class_code: '',
                                            subject_id: '',
                                            day: '',
                                            start_time: '7:30',
                                            end_time: '10:30',
                                            faculty_id: 0,
                                            room_id: 0,

                                            descriptive_title: '',
                                        });
                                        setRoomClassesTime([]);
                                        setInstructorClassesTimes([]);
                                        setClassId(0);
                                        setAddingSecondarySchedule(false);
                                        setAddingSubject(false);
                                        setEditClass(false);
                                        setEditingSecondarySchedule(false);
                                        setClassInvalidFields([""]);
                                    }}
                                    className={`bg-red-500 mr-2 text-white px-4 py-2 rounded hover:bg-opacity-90 transition`}>
                                    Cancel
                                </button >
                            </>
                            :
                            <>
                                < button
                                    onClick={() => {
                                        setAddingSubject(true)
                                        getSubjects()
                                        getDeptRooms()
                                        getInstructors()
                                    }}
                                    className={`bg-blue-500 mr-2 text-white px-4 py-2 rounded hover:bg-opacity-90 transition`}>
                                    Add class
                                </button >
                            </>
                    }

                    {
                        (addingSubject || addingSecondarySchedule || editClass) &&
                        <button
                            disabled={submitting}
                            onClick={submit}
                            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-opacity-90 transition`}>
                            {submitting ? (
                                <>
                                    Submitting
                                    <ImSpinner5 className="inline-block animate-spin ml-1" />
                                </>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    }

                    <div className='mt-4 flex flex-col md:flex-row gap-4 w-full justify-evenly'>
                        {/* Room Schedule */}
                        {((roomClassesTime && addingSubject) || addingSecondarySchedule || editClass) && (
                            <div className='w-full bg-white rounded-lg shadow-lg p-4 flex flex-col'>
                                <div className="text-lg font-semibold mb-4 text-gray-800">Room Schedule <span className="font-medium">({classForm.day})</span></div>
                                {roomClassesTime.length > 0 ? (
                                    roomClassesTime.map((classTime, index) => {

                                        return (
                                            <>
                                                <div key={classTime.id + classTime.start_time} className={`bg-gray-100 rounded-md p-2 shadow-sm my-1
                                            ${getRowClass(classTime, classForm, classTime.year_section_subjects_id ? true : false)}`}>
                                                    {`${convertToAMPM(classTime.start_time)} - ${convertToAMPM(classTime.end_time)}`}
                                                </div>
                                            </>
                                        )
                                    })
                                ) : (
                                    <div className="text-gray-500">No schedule available</div>
                                )}
                            </div>
                        )}

                        {/* Instructor Schedule */}
                        {((instructorClassesTimes && addingSubject) || addingSecondarySchedule || editClass) && (
                            <div className='w-full bg-white rounded-lg shadow-lg p-4 flex flex-col'>
                                <div className="text-lg font-semibold mb-4 text-gray-800">Instructor Schedule <span className="font-medium">({classForm.day})</span></div>
                                {instructorClassesTimes.length > 0 ? (
                                    instructorClassesTimes.map((instructorTime, index) => {
                                        return (
                                            <div key={instructorTime.id + instructorTime.start_time} className={`bg-gray-100 rounded-md p-2 shadow-sm my-1
                                            ${getRowClass(instructorTime, classForm, instructorTime.year_section_subjects_id ? true : false)}`}>
                                                {`${convertToAMPM(instructorTime.start_time)} - ${convertToAMPM(instructorTime.end_time)}`}
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="text-gray-500">No schedule available</div>
                                )}
                            </div>
                        )}
                    </div>
                    {subjectToDelete.deleting &&
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg w-1/3">
                                <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this class?</h2>
                                <div className="flex justify-between gap-4">
                                    <button
                                        disabled={submitting}
                                        className="w-full px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
                                        onClick={deleteClass}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="w-full px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all duration-300"
                                        onClick={() => {
                                            setSubjectToDelete({
                                                deleting: false,
                                                classId: 0,
                                                secondaSched: false,
                                            });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </>
            }
        </>
    );
}

export default YearLevelSectionSubjects;
