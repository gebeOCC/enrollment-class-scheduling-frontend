import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../../axios/axiosInstance';

function Curriculum() {
    const { courseid } = useParams();
    const [searchParams] = useSearchParams();
    const schoolYear = searchParams.get('school_year');
    const [courseName, setCourseName] = useState('');
    const [yearLevels, setYearLevels] = useState([]);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const getYearLevels = async () => {
            await axiosInstance.get(`get-curriculum-terms-subjects/${courseid}/${schoolYear}`)
                .then(response => {
                    console.log(response.data);
                    setYearLevels(response.data);
                });
        };

        const getCourseName = async () => {
            await axiosInstance.get(`get-course-name/${courseid}`)
                .then(response => {
                    setCourseName(response.data);
                });
        };

        getCourseName();
        getYearLevels();
    }, [courseid]);

    const toggleEditing = () => {
        setEditing(!editing);
    };

    return (
        <div className="container mx-auto p-6">

            {/* Course Name and Edit Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-primaryColor">
                    {courseName} ({schoolYear})
                </h1>
                <button
                    onClick={toggleEditing}
                    className={`px-4 py-2 rounded-lg ${editing ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'} hover:bg-opacity-90 transition`}
                >
                    {editing ? 'Stop Editing' : 'Edit'}
                </button>
            </div>

            {/* Year Levels Section */}
            <div className="space-y-6">
                {yearLevels.map((yearLevel, index) => (
                    <div key={index} className="bg-white shadow-md p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-secondaryColor">
                                {yearLevel.year_level_name}
                            </h2>
                            {editing && (
                                <button className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition">
                                    Add Semester
                                </button>
                            )}
                        </div>

                        {yearLevel.curriculum_term.map((curriculum_terms, index) => (
                            < div key={index} className="space-y-4" >
                                {/* Placeholder for Semester 1 */}
                                < div >
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">{curriculum_terms.semester_name} Semester</h3>
                                    <ul className="list-disc list-inside">
                                    </ul>
                                    {editing && (
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded-lg mt-2 hover:bg-blue-600 transition">
                                            Add Subject
                                        </button>
                                    )}
                                </div>

                                {/* Placeholder for Semester 2 */}
                                < div >
                                    <ul className="list-disc list-inside">
                                        <li>Subject 1</li>
                                        <li>Subject 2</li>
                                        <li>Subject 3</li>
                                    </ul>
                                    {editing && (
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded-lg mt-2 hover:bg-blue-600 transition">
                                            Add Subject
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                        }

                    </div >
                ))}
            </div >
        </div >
    );
}

export default Curriculum;
