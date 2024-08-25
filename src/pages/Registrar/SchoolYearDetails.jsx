import { useParams } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import { useEffect, useState } from "react";
function SchoolYearDetails() {
    const { schoolYear } = useParams();
    const { semester } = useParams();

    const [enrollmentStatus, setEnrollmentStatus] = useState('')

    const [schoolYeardetails, setSchoolYeardetails] = useState([])

    useEffect(() => {
        axiosInstance.get(`get-school-year-details/${schoolYear}/${semester}`)
            .then(response => {
                if (response.data.message === "success") {
                    setEnrollmentStatus(response.data.enrollmentStatus)
                    setSchoolYeardetails(response.data.schoolYearDetails)
                }
                console.log(response.data)
            })
    }, [])

    const stopEnrollment = async () => {
        console.log(schoolYeardetails.id);
        await axiosInstance.post(`stop-enrollment/${schoolYeardetails.id}`)
            .then(response => {
                if (response.data.message === "success") {
                    setSchoolYeardetails(prev => ({
                        ...prev,
                        enrollment_status: 'ended'
                    }))
                }
            })
    }

    const startEnrollment = async () => {
        console.log(schoolYeardetails.id);
        await axiosInstance.post(`start-enrollment/${schoolYeardetails.id}`)
            .then(response => {
                if (response.data.message === "success") {
                    setSchoolYeardetails(prev => ({
                        ...prev,
                        enrollment_status: 'ongoing'
                    }))
                }
                console.log(response.data)
            })
    }

    const resumeEnrollment = async () => {
        console.log(schoolYeardetails.id);
        await axiosInstance.post(`resume-enrollment/${schoolYeardetails.id}`)
            .then(response => {
                if (response.data.message === "success") {
                    setSchoolYeardetails(prev => ({
                        ...prev,
                        enrollment_status: 'ongoing'
                    }))
                }
                console.log(response.data)
            })
    }

    return (
        <div className="p-6 bg-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">2024-2025 First Semester</h1>
                {schoolYeardetails.enrollment_status === "ongoing" && (
                    <button
                        onClick={stopEnrollment}
                        className="bg-red-500 text-white px-4 py-2 rounded">
                        Stop Enrollment
                    </button>
                )}

                {schoolYeardetails.enrollment_status === "ended" && (
                    <button
                        onClick={resumeEnrollment}
                        className="bg-orange-400 text-white px-4 py-2 rounded">
                        Resume Enrollment
                    </button>
                )}

                {schoolYeardetails.enrollment_status === null && (
                    <button
                        onClick={startEnrollment}
                        className="bg-primaryColor text-white px-4 py-2 rounded">
                        Start Enrollment
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Student Types</h2>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Student Types</th>
                                <th className="text-right py-2">Freshman</th>
                                <th className="text-right py-2">Old</th>
                                <th className="text-right py-2">Returnee</th>
                                <th className="text-right py-2">Transferee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Add table rows here */}
                            <tr className="border-b">
                                <td className="py-2">BSBA-FM</td>
                                <td className="text-right">173</td>
                                <td className="text-right">505</td>
                                <td className="text-right">102</td>
                                <td className="text-right">75</td>
                            </tr>
                            {/* Add more rows for other programs */}
                        </tbody>
                        <tfoot>
                            <tr className="font-semibold">
                                <td className="py-2">total</td>
                                <td className="text-right">525</td>
                                <td className="text-right">1533</td>
                                <td className="text-right">313</td>
                                <td className="text-right">214</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Enrollment Timeline Table</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Date</th>
                                    {/* Add date columns */}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Add rows for each program */}
                                <tr className="border-b">
                                    <td className="py-2">BSBA-FM</td>
                                    {/* Add enrollment data cells */}
                                </tr>
                                {/* Add more rows for other programs */}
                            </tbody>
                            <tfoot>
                                <tr className="font-semibold">
                                    <td className="py-2">total</td>
                                    {/* Add total cells */}
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SchoolYearDetails;