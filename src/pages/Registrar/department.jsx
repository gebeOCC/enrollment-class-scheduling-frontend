import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import Toast from "../../components/Toast";
import { showToast } from "../../components/Toast";
import PreLoader from "../../components/preloader/PreLoader";
import { ImSpinner5 } from "react-icons/im";

function Department() {
    const [submitting, setSubmitting] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [deptForm, setDeptForm] = useState({
        department_name: '',
        department_name_abbreviation: '',
    });

    const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

    const handleDeptChange = (e) => {
        setDeptForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const addDepartment = () => {
        setIsDeptModalOpen(true);
    };

    const closeModal = () => {
        setIsDeptModalOpen(false);
    };

    const [deptInvalidFields, setDeptInvalidFields] = useState([""]);

    const [departmentsCourses, setDepartmentsCourses] = useState([]);

    const saveDepartment = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        const invalidFields = [];

        if (!deptForm.department_name) invalidFields.push('department_name');
        if (!deptForm.department_name_abbreviation) invalidFields.push('department_name_abbreviation');

        setDeptInvalidFields(invalidFields);

        if (invalidFields.length > 0) {
            setSubmitting(false);
            return;
        }

        await axiosInstance.post(`add-department/`, deptForm)
            .then(response => {
                if (response.data.message === "success") {
                    closeModal();
                    setDeptForm({
                        department_name: '',
                        department_name_abbreviation: '',
                    });
                    showToast(`${deptForm.department_name_abbreviation} Department Added`, 'success')
                    setDepartmentsCourses(response.data.department);
                }
            }).finally(() => {
                setSubmitting(false);
            })
    };

    useEffect(() => {
        axiosInstance.get(`get-departments-courses/`)
            .then(response => {
                setDepartmentsCourses(response.data);
            })
            .finally(() => {
                setFetching(false);
            });
    }, []);

    const [courseForm, setCourseForm] = useState({
        id: '',
        course_name: '',
        course_name_abbreviation: '',
    });

    const courseDept = departmentsCourses.find(department => department.id === courseForm.id);

    const handleCourseChange = (e) => {
        setCourseForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const [courseInvalidFields, setCourseInvalidFields] = useState([""]);

    const submitCourse = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        const invalidFields = [];

        if (!courseForm.course_name) invalidFields.push('course_name');
        if (!courseForm.course_name_abbreviation) invalidFields.push('course_name_abbreviation');

        setCourseInvalidFields(invalidFields);

        if (invalidFields.length > 0) {
            setSubmitting(false);
            return;
        }

        await axiosInstance.post(`add-course/`, courseForm)
            .then(response => {
                if (response.data.message === "success") {
                    setCourseForm({
                        id: '',
                        course_name: '',
                        course_name_abbreviation: '',
                    });
                    showToast(`${courseForm.course_name_abbreviation} Course Added`, 'success')
                    setDepartmentsCourses(response.data.department);
                }
            }).finally(() => {
                setSubmitting(false);
            })
    };

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [facultyAssign, setFacultyAssign] = useState({
        department_id: '',
    });

    const courseDeptAssignHead = departmentsCourses.find(department => department.id === facultyAssign.department_id);

    const [deptFaculties, setDeptFaculties] = useState([]);

    useEffect(() => {
        const getDeptFaculty = async () => {
            await axiosInstance.get(`get-department-faculties/${facultyAssign.department_id}`)
                .then(response => {
                    setDeptFaculties(response.data)
                });
        }
        if (facultyAssign.department_id) {
            getDeptFaculty()
        }
    }, [facultyAssign.department_id])

    const [isAssignNewModalOpen, setIsAssignNewModalOpen] = useState(false);
    const [searchFaculty, setSearchFaculty] = useState("");
    const [facultyIdToAssign, setFacultyIdToAssign] = useState(0);


    const submitAssign = async (id) => {
        setFacultyIdToAssign(id);
        setSubmitting(true);
        await axiosInstance.post(`assign-program-head`, { department_id: facultyAssign.department_id, faculty_id: id })
            .then(response => {
                if (response.data.message === "success") {
                    setDepartmentsCourses(response.data.departments);
                    setIsAssignModalOpen(false)
                    setFacultyAssign({
                        department_id: '',
                    });
                    setSearchFaculty('');
                    showToast(`Assigning success`, 'success');
                }
            })
            .finally(() => {
                setSubmitting(false);
                setFacultyIdToAssign(0);
                setFacultyAssign({ department_id: '' });
                setSearchFaculty('');
            })
    }

    const submitAssignNew = async (id) => {
        setSubmitting(true);
        setFacultyIdToAssign(id);
        await axiosInstance.post(`assign-new-program-head`, { department_id: facultyAssign.department_id, faculty_id: id })
            .then(response => {
                if (response.data.message === "success") {
                    setDepartmentsCourses(response.data.departments);
                    setIsAssignNewModalOpen(false)
                    showToast(`Assigning success`, 'success');
                }
            })
            .then(() => {
                setSubmitting(false);
                setFacultyIdToAssign(0);
                setFacultyAssign({ department_id: '' })
                setSearchFaculty('');
            });
    }

    if (fetching) return <PreLoader />

    return (
        <>
            <div className="space-y-4">
                {departmentsCourses.length > 0 ? (
                    departmentsCourses.map((department, index) => (
                        <div
                            key={index}
                            className="shadow-light rounded-lg p-6 bg-white w-full"
                        >
                            {/* Department Header */}
                            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-secondaryColor font-semibold text-xl">
                                        {department.department_name} ({department.department_name_abbreviation})
                                    </h2>
                                    <p className="text-gray-600 text-sm">Head: {department.full_name || 'No Department Head Assigned'}</p>
                                </div>
                                <button
                                    className="bg-secondaryColor w-full md:w-auto text-white p-2 rounded-md hover:bg-blue-600 transition"
                                    onClick={() => {
                                        if (department.full_name == null) {
                                            setIsAssignModalOpen(!isAssignNewModalOpen);
                                        } else {
                                            setIsAssignNewModalOpen(!isAssignModalOpen);
                                        }
                                        setFacultyAssign({ department_id: department.id });
                                    }}
                                >
                                    {department.full_name == null ? 'Assign Department Head' : 'Assign New Department Head'}
                                </button>
                            </div>

                            {/* Programs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {department.course.map((program, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-100 p-4 rounded-md shadow-sm text-center"
                                    >
                                        <p className="font-medium text-gray-700">{program.course_name}</p>
                                        <p className="text-sm text-gray-500">({program.course_name_abbreviation})</p>
                                    </div>
                                ))}
                            </div>

                            {/* Add Program Button */}
                            <div className="text-right">
                                <button
                                    onClick={() => setCourseForm(prev => ({ ...prev, id: department.id }))}
                                    className="bg-thirdColor text-white py-2 px-4 rounded-md hover:bg-thirdColor-dark transition"
                                >
                                    Add Program
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No departments available.</p>
                )}

                {/* Add Department Button */}
                <div className="text-center">
                    <button
                        className="bg-primaryColor text-white py-2 px-6 rounded-md hover:bg-primaryColor-dark transition"
                        onClick={addDepartment}
                    >
                        Add Department
                    </button>
                </div>
            </div>

            {isDeptModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg w-full max-w-lg mx-4 shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Add Department</h2>

                        <form>
                            {/* Department Name Input */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Department Name:
                                </label>
                                <input
                                    type="text"
                                    value={deptForm.department_name}
                                    name="department_name"
                                    onChange={handleDeptChange}
                                    className={`w-full px-4 py-2 rounded-md border focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out ${deptInvalidFields.includes('department_name') ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter Department Name"
                                    aria-invalid={deptInvalidFields.includes('department_name')}
                                />
                            </div>

                            {/* Name Abbreviation Input */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name Abbreviation:
                                </label>
                                <input
                                    type="text"
                                    value={deptForm.department_name_abbreviation}
                                    name="department_name_abbreviation"
                                    onChange={handleDeptChange}
                                    className={`w-full px-4 py-2 rounded-md border focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out ${deptInvalidFields.includes('department_name_abbreviation') ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter Abbreviation"
                                    aria-invalid={deptInvalidFields.includes('department_name_abbreviation')}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`py-2 px-4 rounded-md text-white bg-primaryColor hover:bg-primaryColor-dark transition`}
                                    onClick={saveDepartment}
                                >

                                    {submitting ? (
                                        <>
                                            Submitting
                                            <ImSpinner5 className="inline-block animate-spin ml-1" />
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Course Modal */}
            {courseForm.id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                    <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800">Add Program</h2>
                        <h3 className="text-secondaryColor font-semibold text-lg mb-6">
                            {courseDept.department_name} ({courseDept.department_name_abbreviation})
                        </h3>

                        <form>
                            {/* Program Name Input */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Program Name:
                                </label>
                                <input
                                    type="text"
                                    value={courseForm.course_name}
                                    name="course_name"
                                    onChange={handleCourseChange}
                                    className={`w-full px-4 py-2 rounded-md border focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out ${courseInvalidFields.includes('course_name') ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter Program Name"
                                    aria-invalid={courseInvalidFields.includes('course_name')}
                                />
                            </div>

                            {/* Name Abbreviation Input */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name Abbreviation:
                                </label>
                                <input
                                    type="text"
                                    value={courseForm.course_name_abbreviation}
                                    name="course_name_abbreviation"
                                    onChange={handleCourseChange}
                                    className={`w-full px-4 py-2 rounded-md border focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out ${courseInvalidFields.includes('course_name_abbreviation') ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter Abbreviation"
                                    aria-invalid={courseInvalidFields.includes('course_name_abbreviation')}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setCourseForm(prev => ({ ...prev, id: '' }))}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    onClick={submitCourse}
                                    className={`py-2 px-4 rounded-md text-white bg-primaryColor hover:bg-primaryColor-dark transition`}
                                >

                                    {submitting ? (
                                        <>
                                            Saving
                                            <ImSpinner5 className="inline-block animate-spin ml-1" />
                                        </>
                                    ) : (
                                        "Save"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isAssignModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl relative">
                        <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
                            Assign Program Head
                        </h2>
                        <h3 className="text-secondaryColor font-semibold text-lg mb-6">
                            {courseDeptAssignHead.department_name} ({courseDeptAssignHead.department_name_abbreviation})
                        </h3>

                        <form onSubmit={submitAssign}>
                            {/* Search Input */}
                            <div className="mb-5">
                                <label
                                    htmlFor="faculty-search"
                                    className="block text-sm font-medium text-gray-600 mb-2"
                                >
                                    Search Faculty:
                                </label>
                                <input
                                    id="faculty-search"
                                    type="text"
                                    value={searchFaculty}
                                    onChange={(e) => setSearchFaculty(e.target.value)}
                                    className="w-full px-4 py-2 border-gray-300 rounded-lg border focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400"
                                    placeholder="Enter faculty name or ID"
                                    aria-label="Search for faculty members"
                                />
                            </div>

                            {/* Faculty List */}
                            <div className="mb-6 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                                {searchFaculty ? (
                                    <ul className="divide-y divide-gray-200">
                                        {deptFaculties
                                            .filter(deptFaculty =>
                                                deptFaculty.full_name.toLowerCase().includes(searchFaculty.toLowerCase()) ||
                                                deptFaculty.user_id_no.toLowerCase().includes(searchFaculty.toLowerCase())
                                            )
                                            .map((deptFaculty, index) => (
                                                <li
                                                    key={index}
                                                    className="p-3 flex justify-between items-center hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium text-gray-700">
                                                            {deptFaculty.user_id_no}
                                                        </span>
                                                        <span className="text-gray-500">-</span>
                                                        <span className="text-gray-700">{deptFaculty.full_name}</span>
                                                    </div>
                                                    <button
                                                        disabled={deptFaculty.user_role === 'program_head'}
                                                        type="button"
                                                        onClick={() => { submitAssign(deptFaculty.id); }}
                                                        className={`${deptFaculty.user_role === 'program_head' || submitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-primaryColor hover:bg-primaryColor-dark'
                                                            } text-white py-2 px-3 rounded-lg transition ${submitting ? 'opacity-50' : ''
                                                            }`}
                                                    >
                                                        {submitting && deptFaculty.id === facultyIdToAssign ? (
                                                            <>
                                                                Assigning... <ImSpinner5 className="inline-block animate-spin ml-1" />
                                                            </>
                                                        ) : (
                                                            'Assign'
                                                        )}
                                                    </button>
                                                </li>
                                            ))}
                                    </ul>
                                ) : (
                                    <p className="text-center text-gray-500 py-6">
                                        Start typing to search for faculty members.
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
                                    onClick={() => {
                                        setIsAssignModalOpen(false);
                                        setSearchFaculty("");
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isAssignNewModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                    <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg relative">
                        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                            <span>Assign New Program Head</span>
                        </h2>
                        <h3 className="text-secondaryColor font-semibold text-lg mb-6">
                            {courseDeptAssignHead.department_name} ({courseDeptAssignHead.department_name_abbreviation})
                        </h3>

                        <form>
                            {/* Search Input */}
                            <div className="mb-5">
                                <label
                                    htmlFor="faculty-search"
                                    className="block text-sm font-medium text-gray-600 mb-2"
                                >
                                    Search Faculty:
                                </label>
                                <input
                                    id="faculty-search"
                                    type="text"
                                    value={searchFaculty}
                                    onChange={(e) => setSearchFaculty(e.target.value)}
                                    className="w-full px-4 py-2 border-gray-300 rounded-lg border focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400"
                                    placeholder="Enter faculty name or ID"
                                    aria-label="Search for faculty members"
                                />
                            </div>

                            {/* Faculty List */}
                            <div className="mb-6 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                                {searchFaculty ? (
                                    <ul className="divide-y divide-gray-200">
                                        {deptFaculties
                                            .filter(deptFaculty =>
                                                deptFaculty.full_name.toLowerCase().includes(searchFaculty.toLowerCase()) ||
                                                deptFaculty.user_id_no.toLowerCase().includes(searchFaculty.toLowerCase())
                                            )
                                            .map((deptFaculty, index) => (
                                                <li
                                                    key={index}
                                                    className="p-3 flex justify-between items-center hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-2 text-md">
                                                        <span className="font-medium text-gray-700">
                                                            {deptFaculty.user_id_no}
                                                        </span>
                                                        <span className="text-gray-500">-</span>
                                                        <span className="text-gray-700">{deptFaculty.full_name}</span>
                                                    </div>
                                                    <button
                                                        disabled={deptFaculty.user_role === 'program_head'}
                                                        type="button"
                                                        onClick={() => { submitAssignNew(deptFaculty.id); }}
                                                        className={`${deptFaculty.user_role === 'program_head' || submitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-primaryColor hover:bg-primaryColor-dark'
                                                            } text-white py-2 px-3 rounded-lg transition ${submitting ? 'opacity-50' : ''
                                                            }`}
                                                    >
                                                        {submitting && deptFaculty.id === facultyIdToAssign ? (
                                                            <>
                                                                Assigning... <ImSpinner5 className="inline-block animate-spin ml-1" />
                                                            </>
                                                        ) : (
                                                            'Assign'
                                                        )}
                                                    </button>
                                                </li>
                                            ))}
                                    </ul>
                                ) : (
                                    <p className="text-center text-gray-500 py-6">
                                        Start typing to search for faculty members.
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
                                    onClick={() => {
                                        setIsAssignNewModalOpen(!isAssignNewModalOpen);
                                        setSearchFaculty("");
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Toast />
        </>
    );
}

export default Department;