import { useState, useEffect } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { Link } from "react-router-dom";
function SchoolYear() {
    const [submitting, setSubmitting] = useState(false);
    const [schoolYearExist, setSchoolYearExist] = useState(false);
    const [semesters, setSemesters] = useState([]);
    const [schoolYears, setSchoolYears] = useState([]);
    
    useEffect(() => {
        axiosInstance.get(`get-school-years`)
            .then(response => {
                setSchoolYears(response.data.school_years)
                setSemesters(response.data.semesters)
            })
    }, [])


    const [isSchoolYearModalOpen, setIsSchoolYearModalOpen] = useState(false)
    const [form, setForm] = useState({
        school_year: '',
        semester_id: '',
    });

    const handleFormChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const [shoolYearInvalidFields, setShoolYearInvalidFields] = useState([""]);

    const submitSchoolYear = async (event) => {
        event.preventDefault();

        const invalidFields = [];

        if (!form.school_year) invalidFields.push('school_year');
        if (!form.semester_id) invalidFields.push('semester_id');

        setShoolYearInvalidFields(invalidFields);

        if (invalidFields.length > 0) {
            setSubmitting(false);
            return;
        }

        await axiosInstance.post(`add-school-year`, form)
            .then(response => {
                if (response.data.message === "School year and semester already exist") {
                    setSchoolYearExist(true);
                } else if (response.data.message === "Success") {
                    setSchoolYears(response.data.schoolYear)
                    setSchoolYearExist(false);
                    setIsSchoolYearModalOpen(false);
                    setForm({
                        school_year: '',
                        semester_id: '',
                    });
                }
            })
    }

    return (
        <>
            <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto mt-10">
                <h2 className="text-2xl font-bold text-center mb-6">School Year List</h2>
                <div className="grid grid-cols-4 gap-4">
                    {schoolYears.map((sy) => (
                        <Link
                            key={sy.id} to={`/school-year/${sy.school_year}/${sy.semester_name}`}>
                            <button
                                className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700 w-full"
                            >
                                <div className="text-center">
                                    <p className="text-sm font-semibold">{sy.school_year}</p>
                                    <p className="text-sm">{sy.semester_name} Semester</p>
                                </div>
                            </button>
                        </Link>
                    ))}

                    <button
                        onClick={() => { setIsSchoolYearModalOpen(true) }}
                        className="bg-green-500 text-white p-4 rounded-lg shadow-md hover:bg-green-600">
                        <div className="text-center text-2xl font-bold">+</div>
                    </button>
                </div>
            </div>

            {isSchoolYearModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md w-1/4">
                        <h2 className="text-3xl font-bold text-center mb-6">Add School Year</h2>

                        <form>
                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-1">School Year</label>
                                <input
                                    value={form.school_year}
                                    name="school_year"
                                    onChange={handleFormChange}
                                    type="text"
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${shoolYearInvalidFields.includes('school_year') && 'border-red-300'}`} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Semester</label>
                                <select
                                    value={form.semester_id}
                                    name="semester_id"
                                    onChange={handleFormChange}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${shoolYearInvalidFields.includes('semester_id') && 'border-red-300'}`}>
                                    {!form.semester_id &&
                                        <option value="" disabled>Select sem...</option>
                                    }
                                    {semesters.map((semesters) => (
                                        <option key={semesters.id} value={semesters.id}>
                                            {semesters.semester_name}
                                        </option>
                                    ))
                                    }
                                </select>
                            </div>
                            {schoolYearExist &&
                                <p className="text-sm text-red-500">School year already exist</p>
                            }
                            <button
                                disabled={submitting}
                                type="submit"
                                onClick={submitSchoolYear}
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mb-2 mt-4">
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsSchoolYearModalOpen(false)}
                                className="w-full border border-thirdColor text-thirdColor py-2 rounded-md hover:bg-thirdColor hover:text-white">
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default SchoolYear