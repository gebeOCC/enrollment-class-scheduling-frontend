import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { capitalizeFirstLetter, getFirstLetter } from "../../utilities/utils";

function PreEnrollmentList() {
    const [pendingList, setPendingList] = useState([]);
    const [enrolledList, setEnrolledList] = useState([]);

    useEffect(() => {
        const getPreEnrollmentList = async () => {
            axiosInstance.get(`get-pre-enrollment-list`)
                .then(response => {
                    console.log(response.data)
                    if (response.data.message === 'success') {
                        setEnrolledList(response.data.enrolled)
                        setPendingList(response.data.pending)
                    }
                })
        }

        getPreEnrollmentList();
    }, []);

    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow overflow-hidden mb-6 text-center flex justify-center items-center">
                <h1 className="text-4xl font-bold text-blue-600">
                    Pre Enrollment List
                </h1>
            </div>

            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white table-auto border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left border-b border-gray-300">#</th>
                            <th className="py-3 px-6 text-left border-b border-gray-300">Name</th>
                            <th className="py-3 px-6 text-left border-b border-gray-300">Course</th>
                            <th className="py-3 px-6 text-left border-b border-gray-300">Year Level</th>
                            <th className="py-3 px-6 text-left border-b border-gray-300">Student Type</th>
                            <th className="py-3 px-6 text-center border-b border-gray-300">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {pendingList.map((pending, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                                <td className="py-3 px-6 text-left">{capitalizeFirstLetter(pending.last_name)}, {capitalizeFirstLetter(pending.first_name)} {pending.middle_name && getFirstLetter(pending.middle_name) + '.'}</td>
                                <td className="py-3 px-6 text-left">{pending.course_name_abbreviation}</td>
                                <td className="py-3 px-6 text-left">{pending.year_level_name}</td>
                                <td className="py-3 px-6 text-left">{pending.student_type_name}</td>
                                <td className="py-3 px-6 text-center">
                                    {pending.user_id_no ? (
                                        <button className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 transition duration-200">Enroll</button>
                                    ) : (
                                        <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition duration-200">Assign ID No</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default PreEnrollmentList;
