import { useEffect, useState } from "react"
import axiosInstance from "../../../axios/axiosInstance"
import { capitalizeFirstLetter, formatFullName, getFirstLetter } from "../../utilities/utils"
import PreLoader from "../../components/preloader/PreLoader";

function PhFacultyList() {
    const [searchBar, setSearchBar] = useState('');
    const [faculties, setFaculties] = useState([]);
    const [editFaculty, setEditFaculty] = useState([]);
    const [activeModal, setActiveModal] = useState(false);
    const [evaluatorModal, setEvaluatorModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [fetching, setFetching] = useState(true);

    const getFacultyList = () => {
        axiosInstance.get(`ph-get-faculty-list`)
            .then(response => {
                setFaculties(response.data)
            })
            .finally(() => {
                setFetching(false);
            })
    }

    useEffect(() => {
        getFacultyList();
    }, [])

    const setEvaluator = async (faculty_id) => {
        setEvaluatorModal(true);
        setEditFaculty(faculties.find(faculty => faculty.faculty_id == faculty_id));
    }

    const setActive = async (faculty_id) => {
        setActiveModal(true);
        setEditFaculty(faculties.find(faculty => faculty.faculty_id == faculty_id));
    }

    const handleActiveConfirm = async () => {
        // setSubmitting(true);
        setActiveModal(false);

        const action = editFaculty.active ? 'set-faculty-inactive' : 'set-faculty-active';
        const newActiveStatus = editFaculty.active ? 0 : 1;

        const oldFacList = faculties;

        const updatedFaculties = faculties.map(faculty =>
            faculty.faculty_id === editFaculty.faculty_id
                ? {
                    ...faculty,
                    active: newActiveStatus
                }
                : faculty
        );
        setFaculties(updatedFaculties);

        await axiosInstance.post(`${action}/${editFaculty.faculty_id}`)
            .then(response => {
                if (response.data.message !== 'success') {
                    setFaculties(oldFacList);
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const handleEvaluatorConfirm = async () => {
        setEvaluatorModal(false);

        const action = editFaculty.user.user_role == "faculty" ? 'set-faculty-evaluator' : 'set-faculty-faculty';
        const evaluator = editFaculty.user.user_role == "faculty" ? 'evaluator' : 'faculty';

        const oldFacList = faculties;

        const updatedFaculties = faculties.map(faculty =>
            faculty.faculty_id === editFaculty.faculty_id
                ? {
                    ...faculty,
                    user: {
                        ...faculty.user,
                        user_role: evaluator
                    }
                }
                : faculty
        );
        setFaculties(updatedFaculties);

        try {
            const response = await axiosInstance.post(`${action}/${editFaculty.faculty_id}`);

            if (response.data.message !== 'success') {
                setFaculties(oldFacList);  // Revert changes if not successful
            } else {
                setEvaluatorModal(false);  // Only close the modal on success
            }
        } catch (error) {
            setFaculties(oldFacList);  // Handle network or other errors
            console.error("Error updating evaluator:", error);
        } finally {
            setSubmitting(false);
        }
    }

    if (fetching) return <PreLoader />

    return (
        <>
            <div className="p-6 bg-white shadow-md rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold mb-2 sm:mb-0">Faculty List</h2>
                    <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-2 w-full sm:w-auto">
                        <input
                            value={searchBar}
                            onChange={(e) => { setSearchBar(e.target.value) }}
                            type="text"
                            placeholder="Search faculty..."
                            className="px-4 py-2 rounded-md mb-2 md:mb-0 w-full sm:w-72 border focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-2 md:px-4 hidden sm:table-cell">#</th>
                                <th className="py-2 px-2 md:px-4">Faculty ID no.</th>
                                <th className="py-2 px-2 md:px-4">Name</th>
                                <th className="py-2 px-2 md:px-4 hidden sm:table-cell">Email</th>
                                <th className="py-2 px-2 md:px-4 hidden sm:table-cell">Status</th>
                                <th className="py-2 px-2 md:px-4 hidden sm:table-cell">Evaluator</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faculties.length > 0 ? (
                                faculties.map((faculty, index) => (
                                    (searchBar === "" || faculty.user.user_id_no.toLowerCase().includes(searchBar.toLowerCase()) ||
                                        (String(faculty.last_name) + String(faculty.first_name) + getFirstLetter(String(faculty.middle_name))).toLowerCase().includes(searchBar.toLowerCase())) &&
                                    <tr
                                        key={index}
                                        className={`border-b ${index % 2 !== 0 ? "bg-[#deeced]" : "bg-white"}`}
                                    >
                                        <td className="py-3 px-4 hidden sm:table-cell text-gray-700">{index + 1}.</td>
                                        <td className="py-3 px-4 text-gray-700">{faculty.user.user_id_no}</td>
                                        <td className="py-3 px-4 text-gray-700">
                                            {formatFullName(faculty.user.user_information)}
                                        </td>
                                        <td className="py-3 px-4 hidden sm:table-cell text-gray-700">{faculty.user.user_information.email_address}</td>
                                        <td className="py-3 px-4 hidden sm:table-cell text-gray-700 transition-transform">
                                            <span
                                                onClick={() => { setActive(faculty.faculty_id) }}
                                                className={`duration-200 hover:scale-105 cursor-pointer px-2 py-1 rounded-full text-xs font-medium  inline-block ${faculty.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {faculty.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 hidden sm:table-cell text-gray-700 overflow-hidden transition-transform">
                                            <div className="flex items-center justify-center">
                                                {faculty.user.user_role === 'program_head' || faculty.user.user_role === 'registrar' ? (
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium text-purple-500">
                                                        {faculty.user.user_role === 'program_head' ? 'Program Head' : 'Registrar'}
                                                    </span>
                                                ) : (
                                                    <span
                                                        onClick={() => { setEvaluator(faculty.faculty_id) }}
                                                        className={`duration-200 hover:scale-105 hover:box-shadow-light cursor-pointer px-2 py-1 rounded-full text-xs font-medium ${faculty.user.user_role === 'evaluator' ? 'bg-gray-100 text-blue-600' : 'bg-gray-100 text-gray-600'}  duration-200 hover:scale-105`}
                                                    >
                                                        {faculty.user.user_role === 'evaluator' ? 'Evaluator' : 'Non-Evaluator'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="py-2 px-2 md:px-4" colSpan="6">
                                        No Data
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {activeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
                        <div className="bg-gray-100 p-3 rounded-t-lg">
                            <h3 className="text-2xl font-bold text-center text-gray-800">Status</h3>
                        </div>
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-semibold leading-relaxed">
                                Set <span className="underline">{formatFullName(editFaculty.user.user_information)}</span> as{' '}
                                <span className={`${editFaculty.active ? 'text-red-600' : 'text-green-600'} font-bold`}>
                                    {editFaculty.active ? 'Inactive' : 'Active'}
                                </span>
                            </h2>
                            <span className="text-sm text-gray-500">
                                {editFaculty.active === 0 ? 'This faculty is currently inactive.' : 'This faculty is currently active.'}
                            </span>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button
                                className="bg-gray-300 text-gray-700 w-full py-2 rounded-lg font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition transform duration-200 hover:scale-105"
                                onClick={() => setActiveModal(false)}
                                aria-label="Cancel action"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={submitting}
                                className="bg-green-500 text-white w-full py-2 rounded-lg font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition transform duration-200 hover:scale-105"
                                onClick={handleActiveConfirm}
                                aria-label="Confirm action"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {evaluatorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
                        {/* Header with dynamic text color */}
                        <div className="bg-gray-100 px-4 py-2 rounded-t-lg shadow-sm">
                            <h3 className={`text-2xl font-bold text-center ${editFaculty.user.user_role === 'faculty' ? 'text-blue-600' : 'text-red-600'}`}>
                                {editFaculty.user.user_role === 'faculty' ? 'Set as Evaluator' : 'Remove as Evaluator'}
                            </h3>
                        </div>

                        {/* Main content */}
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-semibold leading-relaxed">
                                <span className="underline">{formatFullName(editFaculty.user.user_information)}</span>
                            </h2>
                            <span className="text-gray-600">
                                {editFaculty.user.user_role === 'faculty'
                                    ? 'This faculty will be set as an evaluator.'
                                    : 'This faculty will be removed as an evaluator.'}
                            </span>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center space-x-4">
                            <button
                                className="bg-gray-300 text-gray-700 w-full py-2 rounded-lg font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition transform duration-200 hover:scale-105"
                                onClick={() => setEvaluatorModal(false)}
                                aria-label="Cancel action"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={submitting}
                                className="bg-green-500 text-white w-full py-2 rounded-lg font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition transform duration-200 hover:scale-105"
                                onClick={handleEvaluatorConfirm}
                                aria-label="Confirm action"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PhFacultyList;