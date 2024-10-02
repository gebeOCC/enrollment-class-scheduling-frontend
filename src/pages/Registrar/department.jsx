import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import Toast from "../../components/Toast";
import { showToast } from "../../components/Toast";

function Department() {
    const [submitting, setSubmitting] = useState(false);

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
                console.log(response.data);
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

    const [deptFaculties, setDeptFaculties] = useState([]);

    useEffect(() => {
        const getDeptFaculty = async () => {
            await axiosInstance.get(`get-department-faculties/${facultyAssign.department_id}`)
                .then(response => {
                    setDeptFaculties(response.data)
                    console.log(response.data)
                });
        }
        if (facultyAssign.department_id) {
            getDeptFaculty()
        }
    }, [facultyAssign.department_id])

    const [isAssignNewModalOpen, setIsAssignNewModalOpen] = useState(false);
    const [searchFaculty, setSearchFaculty] = useState("");


    const submitAssign = async (id) => {
        console.log(id)
        await axiosInstance.post(`assign-program-head`, { department_id: facultyAssign.department_id, faculty_id: id })
            .then(response => {
                if (response.data.message === "success") {
                    setDepartmentsCourses(response.data.departments);
                    setIsAssignModalOpen(false)
                    setFacultyAssign({
                        department_id: '',
                    });
                    setSearchFaculty('')
                }
                console.log(response.data)
            })
    }

    const submitAssignNew = async (id) => {
        await axiosInstance.post(`assign-new-program-head`, { department_id: facultyAssign.department_id, faculty_id: id })
            .then(response => {
                if (response.data.message === "success") {
                    setDepartmentsCourses(response.data.departments);
                    setIsAssignNewModalOpen(false)
                }
                console.log(response.data)
            })
    }

    return (
        <>
            <div className="container mx-auto p-4">
                {departmentsCourses.map((department, index) => (
                    <div
                        key={index}
                        className="shadow-custom-heavy rounded-md mb-4 p-4 bg-white"
                    >
                        <div className="flex justify-between">
                            <h2 className="text-secondaryColor font-semibold text-xl mb-2">
                                {department.department_name} ({department.department_name_abbreviation})
                            </h2>
                            <h1>
                                {department.full_name}
                            </h1>

                            {department.full_name == null ? (
                                <button
                                    className="bg-secondaryColor text-white px-2 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out mb-2"
                                    onClick={() => {
                                        setIsAssignModalOpen(!isAssignNewModalOpen),
                                            setFacultyAssign({
                                                department_id: department.id
                                            });
                                    }}
                                >Assign Department Head</button>
                            ) : (
                                <button
                                    className="bg-secondaryColor text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out mb-2"
                                    onClick={() => {
                                        setIsAssignNewModalOpen(!isAssignModalOpen),
                                            setFacultyAssign({
                                                department_id: department.id
                                            });
                                    }}
                                >Assign New Department Head</button>
                            )
                            }
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {department.course.map((program, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-200 p-4 text-center"
                                >
                                    {program.course_name} ({program.course_name_abbreviation})
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                setCourseForm(prev => ({
                                    ...prev,
                                    id: department.id,
                                }));
                            }}
                            className="bg-thirdColor text-white py-1 px-4 rounded-md"
                        >
                            Add Program
                        </button>
                    </div>
                ))}
                <button
                    className="bg-primaryColor text-white py-2 px-4 rounded-md mt-4"
                    onClick={addDepartment}
                >
                    Add Department
                </button>
            </div>

            {/* Department */}
            {isDeptModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md w-2/4">
                        <h2 className="text-lg font-bold mb-4">Add Department</h2>
                        <form>
                            <div className="mb-4">
                                <label className={` text-gray-700`}>Department Name:</label>
                                <input
                                    type="text"
                                    value={deptForm.department_name}
                                    name="department_name"
                                    onChange={handleDeptChange}
                                    className={`w-full px-3 py-2 border rounded-md ${deptInvalidFields.includes('department_name') && 'border-red-300'}`}
                                    placeholder="Enter Department Name"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Name Abbreviation:</label>
                                <input
                                    type="text"
                                    value={deptForm.department_name_abbreviation}
                                    name="department_name_abbreviation"
                                    onChange={handleDeptChange}
                                    className={`w-full px-3 py-2 border rounded-md ${deptInvalidFields.includes('department_name_abbreviation') && 'border-red-300'}`}
                                    placeholder="Enter Abbreviation"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-thirdColor text-white py-1 px-3 rounded-md mr-2"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="bg-primaryColor text-white py-1 px-3 rounded-md"
                                    onClick={saveDepartment}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Course */}
            {courseForm.id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md w-2/4">
                        <h2 className="text-lg font-bold">Add Program</h2>
                        <h2 className="text-secondaryColor font-semibold text-xl mb-4">
                            {courseDept.department_name} ({courseDept.department_name_abbreviation})
                        </h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700">Program Name:</label>
                                <input
                                    type="text"
                                    value={courseForm.course_name}
                                    name="course_name"
                                    onChange={handleCourseChange}
                                    className={`w-full px-3 py-2 border rounded-md ${courseInvalidFields.includes('course_name') && 'border-red-300'}`}
                                    placeholder="Enter Program Name"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Name Abbreviation:</label>
                                <input
                                    type="text"
                                    value={courseForm.course_name_abbreviation}
                                    name="course_name_abbreviation"
                                    onChange={handleCourseChange}
                                    className={`w-full px-3 py-2 border rounded-md ${courseInvalidFields.includes('course_name_abbreviation') && 'border-red-300'}`}
                                    placeholder="Enter Abbreviation"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCourseForm(prev => ({
                                            ...prev,
                                            id: '',
                                        }));
                                    }}
                                    className="bg-gray-500 text-white py-1 px-3 rounded-md mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="bg-primaryColor text-white py-1 px-3 rounded-md"
                                    onClick={submitCourse}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isAssignModalOpen &&
                (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                            <h2 id="modal-title" className="text-lg font-bold mb-4 text-gray-900">Assign Program Head</h2>
                            <form onSubmit={submitAssign}>
                                {/* Search Input */}
                                <div className="mb-4">
                                    <label htmlFor="faculty-search" className="block text-gray-700 font-medium mb-2">
                                        Search Faculty:
                                    </label>
                                    <input
                                        id="faculty-search"
                                        type="text"
                                        value={searchFaculty}
                                        name="faculty_id"
                                        onChange={(e) => setSearchFaculty(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                                        placeholder="Enter faculty name or ID"
                                        aria-label="Search for faculty members"
                                    />
                                </div>

                                {/* Faculty List */}
                                <div className="mb-4 max-h-60 overflow-y-auto">
                                    {searchFaculty ? (
                                        <ul className="divide-y divide-gray-200">
                                            {deptFaculties
                                                .filter(deptFaculty =>
                                                    deptFaculty.full_name.toLowerCase().includes(searchFaculty.toLowerCase()) ||
                                                    deptFaculty.user_id_no.toLowerCase().includes(searchFaculty.toLowerCase())
                                                )
                                                .map((deptFaculty, index) => (
                                                    <li key={index} className="p-2 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                                        <div>
                                                            <span className="font-medium text-gray-900">{deptFaculty.user_id_no}</span> -
                                                            <span className="ml-2 text-gray-700">{deptFaculty.full_name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => { submitAssign(deptFaculty.id) }}
                                                            className={`bg-primaryColor text-white py-2 px-4 rounded-md hover:bg-primaryColor-dark transition ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {submitting ? 'Assigning...' : 'Assign'}
                                                        </button>
                                                    </li>
                                                ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">Start typing to search for faculty members.</p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-start space-x-2 mt-4">
                                    <button
                                        type="button"
                                        className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
                                        onClick={() => {
                                            setIsAssignModalOpen(false)
                                            setSearchFaculty("");
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {isAssignNewModalOpen &&
                (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-md w-1/1">
                            <h2 className="text-lg font-bold mb-4">Assign New Program Head</h2>
                            <form>
                                {/* Search Input */}
                                <div className="mb-4">
                                    <label htmlFor="faculty-search" className="block text-gray-700 font-medium mb-2">
                                        Search Faculty:
                                    </label>
                                    <input
                                        id="faculty-search"
                                        type="text"
                                        value={searchFaculty}
                                        name="faculty_id"
                                        onChange={(e) => setSearchFaculty(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                                        placeholder="Enter faculty name or ID"
                                        aria-label="Search for faculty members"
                                    />
                                </div>

                                {/* Faculty List */}
                                <div className="mb-4 max-h-60 overflow-y-auto">
                                    {searchFaculty ? (
                                        <ul className="divide-y divide-gray-200">
                                            {deptFaculties
                                                .filter(deptFaculty =>
                                                    deptFaculty.full_name.toLowerCase().includes(searchFaculty.toLowerCase()) ||
                                                    deptFaculty.user_id_no.toLowerCase().includes(searchFaculty.toLowerCase())
                                                )
                                                .map((deptFaculty, index) => (
                                                    <li key={index} className="p-2 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                                        <div>
                                                            <span className="font-medium text-gray-900">{deptFaculty.user_id_no}</span> -
                                                            <span className="ml-2 text-gray-700">{deptFaculty.full_name}</span>
                                                        </div>
                                                        <button
                                                            disabled={deptFaculty.user_role == 'program_head'}
                                                            type="button"
                                                            onClick={() => { submitAssignNew(deptFaculty.id) }}
                                                            className={`${deptFaculty.user_role == 'program_head' || submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primaryColor hover:bg-primaryColor-dark'
                                                                } text-white py-2 px-4 rounded-md transition ${submitting ? 'opacity-50' : ''
                                                                }`}
                                                        >
                                                            {submitting ? 'Assigning...' : 'Assign'}
                                                        </button>

                                                    </li>
                                                ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">Start typing to search for faculty members.</p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-start space-x-2 mt-4">
                                    <button
                                        type="button"
                                        className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
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
                )
            }
            <Toast />
        </>
    );
}

export default Department;