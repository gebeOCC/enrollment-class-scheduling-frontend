import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../../axios/axiosInstance';
import Toast from '../../components/Toast';
import { showToast } from '../../components/Toast';

function Curriculum() {
    const [submitting, setSubmitting] = useState(false);
    const { courseid } = useParams();
    const [searchParams] = useSearchParams();
    const schoolYear = searchParams.get('school_year');
    const [courseName, setCourseName] = useState('');
    const [yearLevels, setYearLevels] = useState([]);
    const [editing, setEditing] = useState(false);
    const [semesters, setSemesters] = useState([]);
    const [curriculumId, setCurriculumId] = useState(0);

    const getYearLevels = async () => {
        await axiosInstance.get(`get-curriculum-terms-subjects/${courseid}/${schoolYear}`)
            .then(response => {
                console.log(response.data.yearLevels);
                setYearLevels(response.data.yearLevels);
                setCurriculumId(response.data.curriculumId);
            });
    };


    useEffect(() => {
        const getCourseName = async () => {
            await axiosInstance.get(`get-course-name/${courseid}`)
                .then(response => {
                    setCourseName(response.data);
                });
        };

        const getSemesters = async () => {
            await axiosInstance.get(`get-semesters`)
                .then(response => {
                    setSemesters(response.data);
                });
        };
        getCourseName();
        getYearLevels();
        getSemesters();
    }, [courseid]);

    const toggleEditing = () => {
        setEditing(!editing);
    };


    // const schoolYearsData = schoolYears.map((schoolYear) => (
    //     <>
    //         {schoolYear.semester_name === 'First' &&
    //             <option key={schoolYear.id} value={schoolYear.id}>
    //                 {schoolYear.school_year} {schoolYear.semester_name}-Semester
    //             </option>
    //         }
    //     </>
    // ));

    // schoolYearsData.unshift(
    //     <option key="default" disabled value="">
    //         Select school year...
    //     </option>
    // );

    const [addSemester, setAddSemester] = useState({
        id: '',
        semester_id: '',
        year_level_id: '',
        semester_name: '',
        curriculum_id: curriculumId,
    })

    let termLength = 0;
    useEffect(() => {
        yearLevels.some((yearLevel) => {
            if (yearLevel.id == addSemester.year_level_id) {
                termLength = yearLevel.curriculum_term.length;
                console.log(termLength)
                switch (termLength) {
                    case 0:
                        setAddSemester(prev => ({ ...prev, semester_id: 1 }));
                        break;
                    case 1:
                        setAddSemester(prev => ({ ...prev, semester_id: 2 }));
                        break;
                    case 2:
                        setAddSemester(prev => ({ ...prev, semester_id: 3 }));
                        break;
                }
                semesters.map((semester) => {
                    if (semester.id === Number(termLength) + Number(1)) {
                        setAddSemester(prev => ({ ...prev, semester_name: semester.semester_name }));
                    }
                })
                return true;
            }
        });
    }, [addSemester.year_level_id])

    useEffect(() => {
        setAddSemester(prev => ({ ...prev, curriculum_id: curriculumId }));
    }, [curriculumId])

    const submitNewSemester = async () => {
        setSubmitting(true);
        await axiosInstance.post(`add-curriculum-term`, addSemester)
            .then(response => {
                if (response.data.message === 'success') {
                    setAddSemester(prev => ({ ...prev, year_level_id: '' }));
                    showToast('Added successfully!', 'success');
                }
            }).finally(() => {
                setSubmitting(false);
            })
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                {courseName &&
                    <>
                        <h1 className="text-3xl font-bold text-primaryColor">
                            {courseName} ({schoolYear})
                        </h1>

                        <button
                            onClick={toggleEditing}
                            className={`px-4 py-2 rounded-lg ${editing ? 'bg-red-500' : 'bg-blue-500'} text-white hover:bg-opacity-90 transition`}
                        >
                            {editing ? 'Stop Editing' : 'Edit'}
                        </button>
                    </>
                }
            </div>

            <div className="space-y-6">
                {yearLevels.map((yearLevel, yearIndex) => (
                    <div key={yearIndex} className="bg-white shadow-md p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-secondaryColor">
                                {yearLevel.year_level_name}
                            </h2>
                            {editing && (
                                <>
                                    {yearLevel.curriculum_term.length !== 3 &&
                                        <button
                                            onClick={() => {
                                                setAddSemester(prev => ({
                                                    ...prev,
                                                    year_level_id: yearLevel.id
                                                }));
                                            }}
                                            className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition">
                                            Add Semester
                                        </button>
                                    }
                                </>
                            )}
                        </div>

                        {yearLevel.curriculum_term.map((curriculumTerm, termIndex) => (
                            <div key={termIndex} className="mb-6">
                                {/* Subject Table */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border">
                                        <thead className="bg-gray-100">
                                            {/* Semester Name Row */}
                                            <tr>
                                                <th className="py-3 px-4 border text-lg font-semibold text-center bg-gray-200" colSpan="7">
                                                    {curriculumTerm.semester_name} Semester
                                                </th>
                                            </tr>
                                            {/* Column Headers */}
                                            <tr>
                                                <th className="py-2 px-4 border">Subject Code</th>
                                                <th className="py-2 px-4 border">Descriptive Title</th>
                                                <th className="py-2 px-4 border">Credit Units</th>
                                                <th className="py-2 px-4 border">Lecture Hours</th>
                                                <th className="py-2 px-4 border">Laboratory Hours</th>
                                                <th className="py-2 px-4 border">Hrs/Week</th>
                                                <th className="py-2 px-4 border">Pre-requisites</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {curriculumTerm.curriculum_term_subject.map((subject, subjectIndex) => (
                                                <tr key={subjectIndex} className="text-center">
                                                    <td className="py-2 px-4 border">{subject.subject_code}</td>
                                                    <td className="py-2 px-4 border">{subject.descriptive_title}</td>
                                                    <td className="py-2 px-4 border">{subject.credit_units}</td>
                                                    <td className="py-2 px-4 border">{subject.lecture_hours}</td>
                                                    <td className="py-2 px-4 border">{subject.laboratory_hours}</td>
                                                    <td className="py-2 px-4 border">
                                                        {Number(subject.lecture_hours) + Number(subject.laboratory_hours)}
                                                    </td>
                                                    <td className="py-2 px-4 border">{subject.pre_requisite_subject_code}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Add Subject Button */}
                                {editing && (
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded-lg mt-4 hover:bg-blue-600 transition">
                                        Add Subject
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {addSemester.year_level_id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md w-1/4">
                        <h2 className="text-3xl font-bold text-center mb-6">Add {addSemester.semester_name} Semester?</h2>

                        <button
                            disabled={submitting}
                            type="submit"
                            onClick={submitNewSemester}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mb-2">
                            Yes
                        </button>
                        <button
                            type="button"
                            onClick={() => setAddSemester(prev => ({ ...prev, year_level_id: '' }))}
                            className="w-full border border-thirdColor text-thirdColor py-2 rounded-md hover:bg-thirdColor hover:text-white">
                            No
                        </button>
                    </div>
                </div>
            )}
            <Toast />
        </div>
    );
}

export default Curriculum;
