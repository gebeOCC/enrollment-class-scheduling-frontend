import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../../axios/axiosInstance';
import Toast from '../../components/Toast';
import { showToast } from '../../components/Toast';

function Curriculum() {
    const { courseid } = useParams();
    const [searchParams] = useSearchParams();
    const schoolYear = searchParams.get('school_year');

    const [submitting, setSubmitting] = useState(false);
    const [editing, setEditing] = useState(false);
    const [subjectExist, setSubjectExist] = useState(false);

    const [course, setCourse] = useState('');
    const [curriculumId, setCurriculumId] = useState(0);

    const [yearLevels, setYearLevels] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [preRequisites, setPreRequisites] = useState([]);

    const [addSemester, setAddSemester] = useState({
        id: '',
        semester_id: '',
        year_level_id: '',
        semester_name: '',
        curriculum_id: curriculumId,
    })

    const [subjectForm, setSubjectForm] = useState({
        subject_id: '',
        curriculum_term_id: 0,
        subject_code: '',
        descriptive_title: '',
        credit_units: '',
        lecture_hours: '',
        laboratory_hours: '',
        pre_requisite_subject_id: '',
    })

    const getYearLevels = async () => {
        await axiosInstance.get(`get-curriculum-terms-subjects/${courseid}/${schoolYear}`)
            .then(response => {
                setYearLevels(response.data.yearLevels);
                setCurriculumId(response.data.curriculumId);
            });
    };

    useEffect(() => {
        const getCourseName = async () => {
            await axiosInstance.get(`get-course-name/${courseid}`)
                .then(response => {
                    setCourse(response.data);
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

    let termLength = 0;
    useEffect(() => {
        yearLevels.some((yearLevel) => {
            if (yearLevel.id == addSemester.year_level_id) {
                termLength = yearLevel.curriculum_term.length;
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
                    getYearLevels();
                }
            }).finally(() => {
                setSubmitting(false);
            })
    }

    const subjectCodeExist = (subjectCode) => {
        const subject = subjects.find(subject => subject.subject_code === subjectCode);

        if (subject) {
            setSubjectForm(prev => ({
                ...prev,
                subject_code: subject.subject_code,
                subject_id: subject.id,
                descriptive_title: subject.descriptive_title,
                credit_units: subject.credit_units,
                lecture_hours: subject.lecture_hours,
                laboratory_hours: subject.laboratory_hours
            }));
        } else {
            setSubjectForm(prev => ({
                ...prev,
                subject_id: '',
                descriptive_title: '',
                credit_units: '',
                lecture_hours: '',
                laboratory_hours: ''
            }));
        }
    };

    const [typingTimeout, setTypingTimeout] = useState(null);

    const handleSubjectFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'subject_code') {
            const trimmedValue = value.replace(/\s+/g, '');

            setSubjectForm(prev => ({
                ...prev,
                [name]: name === 'subject_code' ? trimmedValue.toUpperCase() : trimmedValue
            }))

            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            const newTimeout = setTimeout(() => {
                subjectCodeExist(value)
            }, 1000);

            setTypingTimeout(newTimeout);
        } else {
            setSubjectForm(prev => ({
                ...prev,
                [name]: name === 'subject_code' ? value.toUpperCase() : value
            }))
        }
    }

    const getSubjects = async () => {
        await axiosInstance.get(`get-subjects`)
            .then(response => {
                setSubjects(response.data)
            })
    }

    const [subjectFormFields, setSubjectFormFields] = useState([""]);

    const submitSubjectForm = async () => {
        setSubmitting(true);
        console.log(subjectForm)
        const invalidFields = [];
        if (!subjectForm.subject_code) invalidFields.push('subject_code');
        if (!subjectForm.descriptive_title) invalidFields.push('descriptive_title');
        if (!subjectForm.credit_units) invalidFields.push('credit_units');

        setSubjectFormFields(invalidFields);
        if (invalidFields.length > 0) {
            setSubmitting(false);
            return;
        }

        await axiosInstance.post(`add-curr-term-subject/${curriculumId}`, subjectForm)
            .then(response => {
                if (response.data.message === 'success') {
                    showToast('Added successfully!', 'success');
                    getYearLevels();
                    getSubjects();
                    setSubjectForm(prev => ({
                        ...prev,
                        curriculum_term_id: 0,
                        subject_code: '',
                        subject_id: '',
                        descriptive_title: '',
                        credit_units: '',
                        lecture_hours: '',
                        laboratory_hours: '',
                        pre_requisite_subject_id: '',
                    }));
                    setSubjectExist(false)
                } else if (response.data.message === 'Subject already exist in this term') {
                    setSubjectExist(true)
                }
            })
            .finally(() => {
                setSubmitting(false);
            })
    }

    const subjectsData = subjects.map((subject) => (
        <option key={subject.id} value={subject.id}>
            {subject.subject_code}
        </option>
    ));

    subjectsData.unshift(
        <option key="default" value="">
            none
        </option>
    );

    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow-light overflow-hidden mb-6 text-center flex justify-between items-center">
                {course.course_name &&
                    <>
                        <h1 className="text-4xl font-bold text-blue-600">
                        {course.course_name} <span className='text-lg sm:text-xl md:text-2xl text-gray-500'> ({schoolYear})</span>
                        </h1>
                        <div className="flex items-center shadow-light p-2 rounded-2xl">
                            <label htmlFor="edit-toggle" className="mr-2 font-semibold text-gray-700">
                                Edit mode
                            </label>
                            <input
                                type="checkbox"
                                id="edit-toggle"
                                checked={editing}
                                onChange={toggleEditing}
                                aria-label="Toggle edit mode"
                                className="appearance-none w-12 h-6 bg-gray-400 rounded-full cursor-pointer transition duration-300 ease-in-out flex justify-start items-center
                                            checked:bg-blue-600 
                                            after:content-[''] 
                                            after:block after:w-5 after:h-5 after:bg-white 
                                            after:rounded-full after:shadow-md 
                                            after:transition-all after:duration-300 
                                            after:translate-x-1 checked:after:translate-x-6   
                                            hover:shadow-lg focus:outline-none"
                            />
                        </div>
                    </>
                }
            </div>

            <div className="space-y-6">
                {yearLevels.map((yearLevel, yearIndex) => (
                    <div key={yearIndex} className="bg-white shadow-light p-6 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-2xl font-bold text-blue-600">
                                {yearLevel.year_level_name}
                            </h2>
                            {editing && yearLevel.curriculum_term.length !== 3 && (
                                <button
                                    onClick={() => {
                                        setAddSemester(prev => ({
                                            ...prev,
                                            year_level_id: yearLevel.id,
                                        }));
                                    }}
                                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                                >
                                    Add Semester
                                </button>
                            )}
                        </div>

                        {yearLevel.curriculum_term.map((curriculumTerm, termIndex) => (
                            <div key={termIndex}>
                                {/* Semester Section */}
                                <div className="p-4 border border-gray-200 bg-gray-100 shadow-sm mb-4 rounded-md">
                                    <h3 className="text-lg font-semibold">
                                        {curriculumTerm.semester_name} Semester
                                    </h3>

                                    {/* Subject Table */}
                                    <div className="overflow-x-auto text-xs">
                                        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                                            <thead>
                                                <tr>
                                                    <th className="py-2 px-4 border border-gray-400">Subject Code</th>
                                                    <th className="py-2 px-4 border border-gray-400">Descriptive Title</th>
                                                    <th className="py-2 px-4 border border-gray-400">Credit Units</th>
                                                    <th className="py-2 px-4 border border-gray-400">Lecture Hours</th>
                                                    <th className="py-2 px-4 border border-gray-400">Laboratory Hours</th>
                                                    <th className="py-2 px-4 border border-gray-400">Hrs/Week</th>
                                                    <th className="py-2 px-4 border border-gray-400">Pre-requisites</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {curriculumTerm.curriculum_term_subject.map((subject, subjectIndex) => (
                                                    <tr key={subjectIndex} className="text-center hover:bg-gray-50">
                                                        <td className="py-2 px-4 border border-gray-400">{subject.subject_code}</td>
                                                        <td className="py-2 px-4 border border-gray-400">{subject.descriptive_title}</td>
                                                        <td className="py-2 px-4 border border-gray-400">{subject.credit_units}</td>
                                                        <td className="py-2 px-4 border border-gray-400">{subject.lecture_hours}</td>
                                                        <td className="py-2 px-4 border border-gray-400">{subject.laboratory_hours}</td>
                                                        <td className="py-2 px-4 border border-gray-400">
                                                            {Number(subject.lecture_hours) + Number(subject.laboratory_hours)}
                                                        </td>
                                                        <td className="py-2 px-4 border border-gray-400">{subject.pre_requisite_subject_code || ''}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {editing && subjectForm.curriculum_term_id === curriculumTerm.id && (
                                        <div className="mt-2 py-2 px-4 bg-white rounded-lg shadow-md">
                                            <div className="grid grid-cols-11 gap-4 text-sm">
                                                <div className="relative col-span-2">
                                                    <label htmlFor="subject_code" className="truncate">Subject Code</label>
                                                    <input
                                                        value={subjectForm.subject_code}
                                                        onChange={handleSubjectFormChange}
                                                        name='subject_code'
                                                        type="text"
                                                        className={`text-center h-8 w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${subjectFormFields.includes('subject_code') && 'border-red-300'}`}
                                                    />

                                                    {/* Conditionally render the dropdown */}
                                                    {subjectForm.subject_code && (!subjectForm.subject_id) && (
                                                        <div className="absolute left-0 right-0 bg-gray-100 max-h-32 overflow-y-auto z-10 mt-1">
                                                            {subjects
                                                                .filter(subject =>
                                                                    subject.subject_code.toUpperCase().includes(subjectForm.subject_code.toUpperCase())
                                                                )
                                                                .map((subject, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                                                                        onClick={() => {
                                                                            setSubjectForm(prev => ({
                                                                                ...prev,
                                                                                subject_code: subject.subject_code,
                                                                                subject_id: subject.id,
                                                                                descriptive_title: subject.descriptive_title,
                                                                                credit_units: subject.credit_units,
                                                                                lecture_hours: subject.lecture_hours,
                                                                                laboratory_hours: subject.laboratory_hours
                                                                            }))
                                                                        }}
                                                                    >
                                                                        {subject.subject_code}
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className='col-span-3'>
                                                    <label htmlFor="descriptive_title" className="truncate">Descriptive Title</label>
                                                    <input
                                                        disabled={subjectForm.subject_id}
                                                        value={subjectForm.descriptive_title}
                                                        onChange={handleSubjectFormChange}
                                                        name='descriptive_title'
                                                        type="text"
                                                        className={`text-center h-8  w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${subjectFormFields.includes('descriptive_title') && 'border-red-300'}`}
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="credit_units" className="truncate">Credit Units</label>
                                                    <select
                                                        disabled={subjectForm.subject_id}
                                                        value={subjectForm.credit_units}
                                                        onChange={handleSubjectFormChange}
                                                        name='credit_units'
                                                        type="text"
                                                        className={`text-center h-8  w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${subjectFormFields.includes('credit_units') && 'border-red-300'}`}
                                                    >
                                                        {!subjectForm.credit_units &&
                                                            <option value="" disabled></option>
                                                        }
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="3">6</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="lecture_hours" className="truncate">Lec Hours</label>
                                                    <select
                                                        disabled={subjectForm.subject_id}
                                                        value={subjectForm.lecture_hours}
                                                        onChange={handleSubjectFormChange}
                                                        name='lecture_hours'
                                                        type="text"
                                                        className={`text-center h-8  w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400`}
                                                    >
                                                        <option value=""></option>
                                                        <option value="3">3</option>
                                                        <option value="2">2</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="laboratory_hours" className="truncate">Lab Hours</label>
                                                    <select
                                                        disabled={subjectForm.subject_id}
                                                        value={subjectForm.laboratory_hours}
                                                        onChange={handleSubjectFormChange}
                                                        name='laboratory_hours'
                                                        type="text"
                                                        className="text-center h-8  w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    >
                                                        <option value=""></option>
                                                        <option value="3">3</option>
                                                    </select>
                                                </div>

                                                <div className='col-span-2'>
                                                    <label htmlFor="pre_requisite_subject_code" className="truncate">Pre-requisite</label>
                                                    <select
                                                        value={subjectForm.pre_requisite_subject_id}
                                                        onChange={handleSubjectFormChange}
                                                        name='pre_requisite_subject_id'
                                                        type="text"
                                                        className="text-center h-8  w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    >
                                                        {subjectsData}
                                                    </select>
                                                </div>

                                                <div className='flex gap-2 mt-5'>
                                                    <button
                                                        onClick={() => { setSubjectForm(prev => ({ ...prev, curriculum_term_id: 0 })); setSubjectExist(false) }}
                                                        className="h-8 w-10 px-2 py-1 bg-gray-500 text-white hover:bg-gray-600 transition flex items-center justify-center"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        disabled={submitting}
                                                        onClick={submitSubjectForm}
                                                        className="h-8 w-10 px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 transition flex items-center justify-center"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                {subjectExist &&
                                                    <h1 className='col-span-4 text-red-500'>Subject already exist in the current term</h1>
                                                }
                                            </div>
                                        </div>
                                    )}

                                    {/* Add Subject Button */}
                                    {editing && subjectForm.curriculum_term_id === 0 && (
                                        <div className="mt-2 flex justify-end">
                                            <button
                                                onClick={
                                                    () => {
                                                        setSubjectForm(prev => ({
                                                            ...prev, curriculum_term_id: curriculumTerm.id
                                                        }));
                                                        getSubjects();
                                                    }}
                                                className="bg-blue-600 text-white px-3 py-1 hover:bg-blue-700 transition"
                                            >
                                                Add Subject
                                            </button>
                                        </div>
                                    )}
                                </div>
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
        </>
    );
}

export default Curriculum;
