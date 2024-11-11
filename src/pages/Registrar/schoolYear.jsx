import { useState, useEffect } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { Link } from "react-router-dom";
import { formatDateShort } from "../../utilities/utils";
import { ImSpinner5 } from "react-icons/im";
import PreLoader from "../../components/preloader/PreLoader";
function SchoolYear() {
    const [submitting, setSubmitting] = useState(false);
    const [enrollmentConflict, setEnrollmentConflict] = useState(false);
    const [semesters, setSemesters] = useState([]);
    const [schoolYears, setSchoolYears] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [isSchoolYearModalOpen, setIsSchoolYearModalOpen] = useState(false)
    const [form, setForm] = useState({
        semester_id: '',
        start_year: '',
        end_year: '',
        start_date: '',
        end_date: '',
    });

    const getSChoolYears = async () => {
        axiosInstance.get(`get-school-years`)
            .then(response => {
                setSchoolYears(response.data.school_years)

                console.table(response.data.school_years)
                setSemesters(response.data.semesters)
                const lastSchoolYear = response.data.school_years[0];
                if (lastSchoolYear) {
                    if (lastSchoolYear.semester_id === 3) {
                        console.log(lastSchoolYear.semester_id)
                        setForm(prev => ({
                            ...prev,
                            semester_id: '1',
                            start_year: lastSchoolYear.end_year,
                            end_year: Number(lastSchoolYear.end_year) + 1,
                        }));
                    } else {
                        setForm(prev => ({
                            ...prev,
                            semester_id: Number(lastSchoolYear.semester_id) + 1,
                            start_year: lastSchoolYear.start_year,
                            end_year: lastSchoolYear.end_year,
                        }));
                    }
                }
            })
            .finally(() => {
                setFetching(false);
            })
    }

    useEffect(() => {
        getSChoolYears();
    }, [])


    const handleFormChange = (e) => {
        const { name, value } = e.target;

        // Ensure that start_year is positive
        if (name === "start_year") {
            if (value === '' || (Number(value) >= 1 && value.length <= 4)) {
                setForm(prev => ({
                    ...prev,
                    [name]: value,
                    end_year: value ? Number(value) + 1 : ''
                }));
            }
            return;
        }

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const [shoolYearInvalidFields, setShoolYearInvalidFields] = useState([""]);

    const submitSchoolYear = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        const invalidFields = [];

        if (!form.semester_id) invalidFields.push('semester_id');
        if (!form.start_year) invalidFields.push('start_year');
        if (!form.end_year) invalidFields.push('end_year');
        if (!form.start_date) invalidFields.push('start_date');
        if (!form.end_date) invalidFields.push('end_date');

        setShoolYearInvalidFields(invalidFields);

        if (invalidFields.length > 0) {
            setSubmitting(false);
            return;
        }

        await axiosInstance.post(`add-school-year`, form)
            .then(response => {
                if (response.data.message === "There's a conflict with an existing enrollment period.") {
                    setEnrollmentConflict(true);
                } else if (response.data.message === "Success") {
                    getSChoolYears();
                    setEnrollmentConflict(false);
                    setIsSchoolYearModalOpen(false);
                    setForm({
                        school_year: '',
                        semester_id: '',
                    });
                }
            })
            .finally(() => {
                setSubmitting(false);
            })
    }

    const [searchTerm, setSearchTerm] = useState('');

    // Filter school years based on the search term
    const filteredSchoolYears = schoolYears.filter(sy => `${sy.start_year}-${sy.end_year}`.includes(searchTerm));

    // Limit to 4 school years unless "See More" is clicked
    const schoolYearsToShow = showAll ? filteredSchoolYears : filteredSchoolYears.slice(0, 8);

    // Function to add 20 days to a given date
    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().split('T')[0];
    };

    if (fetching) return <PreLoader />

    return (
        <>

            <h2 className="text-2xl font-bold text-center mb-4">School Year List</h2>

            {/* Search Bar */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <input
                    type="text"
                    placeholder="Search School Year (e.g., 2021-2022)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/3 mb-4 sm:mb-0 focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out "
                />

                {/* Add School Year Button */}
                <button
                    onClick={() => { setIsSchoolYearModalOpen(true) }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Add School Year
                </button>
            </div>

            {/* School Year List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {schoolYearsToShow.length > 0 ? (
                    schoolYearsToShow.map((sy, index) => (
                        <Link
                            key={index}
                            to={`/school-year/${sy.start_year}-${sy.end_year}/${sy.semester_name}`}
                        >
                            <div className="bg-white rounded-lg shadow-md w-full hover:shadow-xl transition-shadow h-32 relative  flex justify-center items-center">
                                <div className="text-center mb-4">
                                    <p className="text-lg font-semibold">{`${sy.start_year}-${sy.end_year}`}</p>
                                    <p className="text-md text-gray-800">{sy.semester_name} Semester</p>
                                </div>
                                <p className="text-xs text-gray-600 absolute bottom-2 left-2">{formatDateShort(sy.start_date)} - {formatDateShort(sy.end_date)}</p>

                                {/* Current and Ongoing Indicators */}
                                <div className="absolute top-2 right-2">
                                    {sy.is_current === 1 && (
                                        <span className="bg-green-500 text-white text-xs font-bold rounded-full px-2 py-1 mr-1">Current</span>
                                    )}
                                    {sy.enrollment_ongoing === 1 && (
                                        <span className="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1">Ongoing</span>
                                    )}
                                    {(!sy.enrollment_ongoing && !!sy.preparation) && (
                                        <span className="bg-yellow-500 text-white text-xs font-bold rounded-full px-2 py-1">Preparing</span>
                                    )}

                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center col-span-4">No school years found</p>
                )}
            </div>

            {/* See More / See Less Button */}
            {filteredSchoolYears.length > 4 && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-blue-500 underline"
                    >
                        {showAll ? 'See Less' : 'See More'}
                    </button>
                </div>
            )}

            {isSchoolYearModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4">
                    <div className="bg-white p-6 rounded-md w-90">
                        <h2 className="text-3xl font-bold text-center mb-4">Add School Year</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">School Year</label>
                                <div className="flex space-x-2">
                                    <input
                                        disabled={schoolYears.length > 0}
                                        value={form.start_year}
                                        name="start_year"
                                        onChange={handleFormChange}
                                        type="number"
                                        min="1"
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out ${shoolYearInvalidFields.includes('start_year') && 'border-red-300'
                                            }`}
                                    />
                                    <h1 className="text-4xl">-</h1>
                                    <input
                                        disabled={true}
                                        value={form.end_year}
                                        name="end_year"
                                        type="number"
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out ${shoolYearInvalidFields.includes('end_year') && 'border-red-300'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Semester</label>
                                <select
                                    disabled={schoolYears.length > 0}
                                    value={form.semester_id}
                                    name="semester_id"
                                    onChange={handleFormChange}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out ${shoolYearInvalidFields.includes('semester_id') && 'border-red-300'
                                        }`}
                                >
                                    {!form.semester_id && <option value="" disabled>Select semester...</option>}
                                    {semesters.map((semester) => (
                                        <option key={semester.id} value={semester.id}>
                                            {semester.semester_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <label className="block text-sm font-medium mb-1">Enrollment date:</label>
                            <div className="flex justify-between gap-2">
                                <div className="w-full">
                                    <label className="block text-xs font-medium">Start</label>
                                    <input
                                        onChange={handleFormChange}
                                        name="start_date"
                                        type="date"
                                        min={`${form.start_year}-01-01`}  // Set the minimum year based on form.start_year
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out cursor-pointer ${shoolYearInvalidFields.includes('start_date') && 'border-red-300'}`}
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="block text-xs font-medium">End</label>
                                    <input
                                        min={form.start_date ? addDays(form.start_date, 20) : ''}
                                        onChange={handleFormChange}
                                        name="end_date"
                                        type="date"
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out cursor-pointer ${shoolYearInvalidFields.includes('end_date') && 'border-red-300'}`}
                                    />
                                </div>
                            </div>

                            {enrollmentConflict && (
                                <>
                                    <p className="text-sm text-red-500">There's a conflict with an existing enrollment period.</p>
                                </>
                            )}

                            <button
                                disabled={submitting}
                                type="submit"
                                onClick={submitSchoolYear}
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mb-2  mt-4"
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

                            <button
                                type="button"
                                onClick={() => setIsSchoolYearModalOpen(false)}
                                className="w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-300"
                            >
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