import { useParams } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import { useEffect, useState } from "react";
function SchoolYearDetails() {
    const { schoolYear } = useParams();
    const { semester } = useParams();

    const [submitting, setSubmitting] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [schoolYeardetails, setSchoolYeardetails] = useState([])

    const getSChoolYearDetails = async () => {
        axiosInstance.get(`get-school-year-details/${schoolYear}/${semester}`)
            .then(response => {
                if (response.data.message === "success") {
                    setSchoolYeardetails(response.data.schoolYearDetails)
                    setFetching(false);
                }
                console.log(response.data)
            })
    }
    useEffect(() => {
        getSChoolYearDetails();
    }, [])

    if (fetching) {
        return <div></div>;
    }

    const setAsDefault = async () => {
        setSubmitting(true);
        await axiosInstance.post(`set-sy-default/${schoolYeardetails.id}`)
            .then(response => {
                if (response.data.message === 'success') {
                    getSChoolYearDetails();
                }
            })
            .finally(() => {
                setSubmitting(false);
            })
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
                <h1 className="text-2xl font-bold w-max text-center sm:text-left">
                    {schoolYeardetails.start_year}-{schoolYeardetails.end_year} {schoolYeardetails.semester_name} Semester
                </h1>
                <div className="mt-2 sm:mt-0 flex sm:flex-row items-center gap-2">
                    {schoolYeardetails.is_current ? (
                        <span className="bg-green-500 text-white text-xs font-bold rounded-full px-2 py-1 sm:mb-0">
                            Current
                        </span>
                    ) : (
                        <button
                            disabled={submitting}
                            onClick={setAsDefault}
                            className="bg-blue-500 text-white text-xs font-bold uppercase rounded-full px-4 py-2 transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-blue-600">
                            Set as Current
                        </button>
                    )}

                    {schoolYeardetails.enrollment_ongoing !== 0 && (
                        <span className="bg-yellow-500 text-white text-xs font-bold rounded-full px-2 py-1">Enrollment Ongoing</span>
                    )}
                </div>
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
                            <tr className="border-b">
                                <td className="py-2">BSBA-FM</td>
                                <td className="text-right">173</td>
                                <td className="text-right">505</td>
                                <td className="text-right">102</td>
                                <td className="text-right">75</td>
                            </tr>
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
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-2">BSBA-FM</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className="font-semibold">
                                    <td className="py-2">total</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SchoolYearDetails;