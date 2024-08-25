import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";

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

    const [departmentsCourses, setDepartmentsCourses] = useState([]);

    const saveDepartment = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        await axiosInstance.post(`add-department/`, deptForm)
            .then(response => {
                if (response.data.message === "success") {
                    closeModal();
                    setDeptForm({
                        department_name: '',
                        department_name_abbreviation: '',
                    });
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

    const submitCourse = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        await axiosInstance.post(`add-course/`, courseForm)
            .then(response => {
                if (response.data.message === "success") {
                    setCourseForm({
                        id: '',
                        course_name: '',
                        course_name_abbreviation: '',
                    });
                    setDepartmentsCourses(response.data.department);
                }
            }).finally(() => {
                setSubmitting(false);
            })
    };


    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [facultyAssign, setFacultyAssign] = useState({
        faculty_id: '',
        department_id: '',
    });

    const submitAssign = async (e) => {
        e.preventDefault();
        await axiosInstance.post(`assign-program-head`, facultyAssign)
            .then(response => {
                if (response.data.message === "success") {
                    setDepartmentsCourses(response.data.departments);
                    setIsAssignModalOpen(false)
                    setFacultyAssign({
                        faculty_id: '',
                        department_id: '',
                    });
                }
                console.log(response.data)
            })
    }

    const [isAssignNewModalOpen, setIsAssignNewModalOpen] = useState(false);
    const [facultyAssignNew, setFacultyAssignNew] = useState({
        faculty_id: '',
        department_id: '',
    });

    const submitAssignNew = async (e) => {
        e.preventDefault();
        console.log(facultyAssignNew)
        await axiosInstance.post(`assign-new-program-head`, facultyAssignNew)
            .then(response => {
                if (response.data.message === "success") {
                    setDepartmentsCourses(response.data.departments);
                    setIsAssignNewModalOpen(false)
                    setFacultyAssignNew({
                        faculty_id: '',
                        department_id: '',
                    });
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

                            {department.user_id_no == null ? (
                                <button
                                    className="bg-secondaryColor text-white px-2 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out mb-2"
                                    onClick={() => {
                                        setIsAssignModalOpen(!isAssignNewModalOpen),
                                            setFacultyAssign(prev => ({
                                                ...prev,
                                                department_id: department.id
                                            }));
                                    }}
                                >Assign Department Head</button>
                            ) : (
                                <button
                                        className="bg-secondaryColor text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out mb-2"
                                    onClick={() => {
                                        setIsAssignNewModalOpen(!isAssignModalOpen),
                                            setFacultyAssignNew(prev => ({
                                                ...prev,
                                                department_id: department.id
                                            }));
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
                                <label className="block text-gray-700">Department Name:</label>
                                <input
                                    type="text"
                                    value={deptForm.department_name}
                                    name="department_name"
                                    onChange={handleDeptChange}
                                    className="w-full px-3 py-2 border rounded-md"
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
                                    className="w-full px-3 py-2 border rounded-md"
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
                                    className="w-full px-3 py-2 border rounded-md"
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
                                    className="w-full px-3 py-2 border rounded-md"
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
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-md w-1/1">
                            <h2 className="text-lg font-bold mb-4">Assign Program Head</h2>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Faculty ID no:</label>
                                    <input
                                        type="text"
                                        value={facultyAssign.faculty_id}
                                        name="faculty_id"
                                        onChange={(e) => {
                                            setFacultyAssign(prev => ({
                                                ...prev,
                                                faculty_id: e.target.value
                                            }));
                                        }}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="Enter Department Name"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="bg-thirdColor text-white py-1 px-3 rounded-md mr-2"
                                        onClick={() => { setIsAssignModalOpen(!isAssignModalOpen) }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="bg-primaryColor text-white py-1 px-3 rounded-md"
                                        onClick={submitAssign}
                                    >
                                        Assign
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
                                <div className="mb-4">
                                    <label className="block text-gray-700">Faculty ID no:</label>
                                    <input
                                        type="text"
                                        value={facultyAssignNew.faculty_id}
                                        name="faculty_id"
                                        onChange={(e) => {
                                            setFacultyAssignNew(prev => ({
                                                ...prev,
                                                faculty_id: e.target.value
                                            }));
                                        }}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="Enter Department Name"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="bg-thirdColor text-white py-1 px-3 rounded-md mr-2"
                                        onClick={() => { setIsAssignNewModalOpen(!isAssignNewModalOpen) }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="bg-primaryColor text-white py-1 px-3 rounded-md"
                                        onClick={submitAssignNew}
                                    >
                                        Assign
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default Department;
