import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../../../axios/axiosInstance';

function YearLevelSectionSubjects() {
    const { courseid, yearlevel } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get('section');

    const formattedYearLevel = yearlevel.replace(/-/g, ' ');

    const [addingSubject, setAddingSubject] = useState(false);

    const [course, setCourse] = useState([]);

    const [classForm, setClassForm] = useState({
        class_code: '',
        subject_id: '',
        day: '',
        start_time: '',
        end_time: '',
        faculty_id: '',
        room_id: '',

        descriptive_title: '',
    });

    const handleClassFormChange = (e) => {
        setClassForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        const getCourseName = async () => {
            await axiosInstance.get(`get-course-name/${courseid}`)
                .then(response => {
                    setCourse(response.data);
                });
        };

        getCourseName()
    }, [courseid]);

    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow overflow-hidden mb-6 text-center">
                {course.course_name &&
                    <>
                        <h1 className="text-4xl font-bold text-blue-600">
                            {course.course_name_abbreviation} - 1A
                        </h1>
                    </>
                }
            </div>
            {addingSubject &&
                <div className="mb-6 py-2 px-4 bg-white rounded-lg shadow-md">
                    <div className="grid grid-cols-9 gap-4 text-sm">
                        <div className='col-span-1'>
                            <label htmlFor="descriptive_title" className="truncate">Class Code</label>
                            <input
                                value={classForm.class_code}
                                onChange={handleClassFormChange}
                                name='class_code'
                                type="text"
                                className="h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor="descriptive_title" className="truncate">Subject Code</label>
                            <input
                                value={classForm.subject_code}
                                onChange={handleClassFormChange}
                                name='subject_code'
                                type="text"
                                className="h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className='col-span-2'>
                            <label htmlFor="descriptive_title" className="truncate">Descriptive Title</label>
                            <input
                                // readOnly={true}
                                value={classForm.descriptive_title}
                                onChange={handleClassFormChange}
                                name='descriptive_title'
                                type="text"
                                className="h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor="day" className="truncate">Day</label>
                            <select
                                value={classForm.day}
                                onChange={handleClassFormChange}
                                name='day'
                                className="h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400"
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

                        <div className='col-span-1'>
                            <label htmlFor="descriptive_title" className="truncate">Start Time</label>
                            <input
                                // readOnly={true}
                                value={classForm.start_time}
                                onChange={handleClassFormChange}
                                name='start_time'
                                type="text"
                                className="h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor="descriptive_title" className="truncate">End Time</label>
                            <input
                                // readOnly={true}
                                value={classForm.end_time}
                                onChange={handleClassFormChange}
                                name='end_time'
                                type="text"
                                className="h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor="descriptive_title" className="truncate">Room</label>
                            <input
                                // readOnly={true}
                                value={classForm.room_id}
                                onChange={handleClassFormChange}
                                name='room_id'
                                type="text"
                                className="h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor="descriptive_title" className="truncate">Instructor</label>
                            <input
                                // readOnly={true}
                                value={classForm.faculty_id}
                                onChange={handleClassFormChange}
                                name='faculty_id'
                                type="text"
                                className="h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
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
                    className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-opacity-90 transition`}>
                    Submit
                </button>
            }
        </>
    );
}

export default YearLevelSectionSubjects;
