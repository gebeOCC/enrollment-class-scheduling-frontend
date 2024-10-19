import { useEffect, useState } from "react"
import axiosInstance from "../../../axios/axiosInstance"
import { capitalizeFirstLetter, formatFullName, getFirstLetter } from "../../utilities/utils"

function PhFacultyList() {

    const [searchBar, setSearchBar] = useState('')
    const [faculties, setFaculties] = useState([])
    const getFacultyList = () => {
        axiosInstance.get(`ph-get-faculty-list`)
            .then(response => {
                setFaculties(response.data)
                console.log(response.data)
            })
    }

    useEffect(() => {
        getFacultyList();
    }, [])

    const setEvaluator = async () => {

    }

    const setActive = async () => {

    }

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
                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2 md:mb-0"
                        />
                        <button
                            onClick={() => { setIsFacultyModalOpen(true) }}
                            className="bg-primaryColor text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-2 md:mb-0 hidden sm:block">
                            Add Faculty
                        </button>
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
                                <th className="py-2 px-2 md:px-4 hidden sm:table-cell">Evaluator</th>
                                <th className="py-2 px-2 md:px-4 hidden sm:table-cell">Status</th>
                                <th className="py-2 px-2 md:px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faculties.length > 0 ? (
                                faculties.map((faculty, index) => (
                                    (searchBar === "" || faculty.user_id_no.toLowerCase().includes(searchBar.toLowerCase()) ||
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
                                        <td className="py-3 px-4 hidden sm:table-cell text-gray-700">
                                            <span className={`cursor-pointer px-2 py-1 rounded-full text-xs font-medium ${faculty.status ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {faculty.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 hidden sm:table-cell text-gray-700">
                                            <span className={`cursor-pointer px-2 py-1 rounded-full text-xs font-medium ${faculty.user.user_role === 'evaluator' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                                {faculty.user.user_role === 'evaluator' ? 'Evaluator' : 'Non-Evaluator'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg shadow-md focus:outline-none">
                                                Action
                                            </button>
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
        </>
    )
}

export default PhFacultyList;