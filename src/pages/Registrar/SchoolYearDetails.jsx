import { useParams } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import { useEffect, useState } from "react";
import PreLoader from "../../components/preloader/PreLoader";
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
        return <PreLoader />;
    }

    if (!schoolYeardetails) {
        return (
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center items-center">
                    <h1 className="text-4xl font-bold text-blue-600">
                        {schoolYear} {semester} Semester{" "}
                    </h1>
                    <h2 className="text-red-600 text-3xl"> didn’t exist!</h2>
                </div>
            </div>
        )
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
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex justify-between items-center">
                <h1 className="text-4xl font-bold text-blue-600">
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
                            className="bg-green-300 text-black text-xs font-bold rounded-full px-2 py-1 transition-transform duration-300 ease-in-out transform shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                            Set as Current
                        </button>
                    )}

                    {!!schoolYeardetails.enrollment_ongoing && (
                        <span className="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1">Enrollment Ongoing</span>
                    )}
                    {(!schoolYeardetails.enrollment_ongoing && !!schoolYeardetails.preparation) && (
                        <span className="bg-yellow-500 text-white text-xs font-bold rounded-full px-2 py-1">Enrollment Preparing</span>
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
        </div>
    );
}

export default SchoolYearDetails;