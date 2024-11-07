import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { useLocation, useParams, useNavigate, Navigate } from "react-router-dom";
import { capitalizeFirstLetter, convertToAMPM, formatDate, formatFullName, getFirstLetter } from "../../utilities/utils";
import Loading from "../../components/Loading";
import { useReactToPrint } from "react-to-print";

function StudentCor() {
    const { courseid, yearlevel, section } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const [courseName, setCourseName] = useState([]);
    const [studentInfo, setStudentInfo] = useState([]);
    const studentId = searchParams.get('student-id');
    const [fetching, setFetching] = useState(true);
    const componentRef = useRef(null);

    useEffect(() => {
        const getCourseName = async () => {
            await axiosInstance.get(`get-course-name/${courseid}`)
                .then(response => {
                    setCourseName(response.data);
                });
        };

        const getStudentEnrollmentInfo = async () => {
            const yearLevelNumber =
                yearlevel === 'First-Year' ? '1' :
                    yearlevel === 'Second-Year' ? '2' :
                        yearlevel === 'Third-Year' ? '3' :
                            yearlevel === 'Fourth-Year' ? '4' : '';

            await axiosInstance.get(`get-student-enrollment-info/${courseid}/${yearLevelNumber}/${section}/${studentId}`)
                .then(response => {
                    if (response.data.message === 'success') {
                        console.log(response.data);
                        setStudentInfo(response.data.studentinfo);
                    }
                })
                .finally(() => {
                    setFetching(false);
                });
        };

        getCourseName();
        getStudentEnrollmentInfo();
    }, [courseid, yearlevel, section]);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
    });

    if (fetching) return <Loading />

    return (
        <div className="space-y-4">
            <div ref={componentRef} className="space-y-4 p-5">
                <div className="p-5 border border-gray-900">
                    <div className="mb-8 text-center">
                        <h1 className="text-lg font-bold">OPOL COMMUNITY COLLEGE</h1>
                        <p className="text-sm">Opol, Misamis Oriental</p>
                        <h2 className="text-xl font-bold mt-4 mb-8">CERTIFICATE OF REGISTRATION</h2>
                    </div>

                    <div className="grid grid-cols-[130px,1fr,1fr,130px,1fr,1fr,100px,1fr,1fr] text-sm">
                        <div className="col-span-1 font-bold">Registration No.:</div>
                        <div className="col-span-2 border-b border-gray-900">{studentInfo.registration_number}</div>

                        <div className="col-span-6 "></div>

                        <div className="col-span-1 font-bold">Date Enrolled:</div>
                        <div className="col-span-2 border-b border-gray-900">{formatDate(studentInfo.date_enrolled)}</div>

                        <div className="col-span-1 font-bold text-center">Semester:</div>
                        <div className="col-span-2 border-b border-gray-900">{studentInfo.year_section.school_year.semester.semester_name}</div>

                        <div className="col-span-1 font-bold">School Year:</div>
                        <div className="col-span-2 border-b border-gray-900">{studentInfo.year_section.school_year.start_year}-{studentInfo.year_section.school_year.end_year}</div>

                        <div className="col-span-1 font-bold">Student ID No.:</div>
                        <div className="col-span-2 border-b border-gray-900">{studentInfo.user.user_id_no}</div>

                        <div className="col-span-1 font-bold text-center">Course & Year:</div>
                        <div className="col-span-2 border-b border-gray-900">{courseName.course_name_abbreviation} -{' '}
                            {{
                                'First-Year': '1', 'Second-Year': '2', 'Third-Year': '3', 'Fourth-Year': '4'
                            }[yearlevel] || ''}{section}
                        </div>

                        <div className="col-span-1 font-bold">Gender:</div>
                        <div className="col-span-2 border-b border-gray-900">{studentInfo.user.user_information.gender}</div>

                        <div className="col-span-1 font-bold">Name:</div>
                        <div className="col-span-1 border-b border-gray-900">{studentInfo.user.user_information.last_name},</div>
                        <div className="col-span-1 border-b border-gray-900">{studentInfo.user.user_information.first_name}</div>
                        <div className="col-span-1 border-b border-gray-900">{studentInfo.user.user_information.middle_name}</div>
                        <div className="col-span-2 "></div>
                        <div className="col-span-1 font-bold">Student Type:</div>
                        <div className="col-span-2 border-b border-gray-900">{studentInfo.student_type.student_type_name}</div>

                        <div className="col-span-1 text-xs italic col-start-2 text-gray-600">Last Name</div>
                        <div className="col-span-1 text-xs italic text-gray-600">First Name</div>
                        <div className="col-span-1 text-xs italic text-gray-600">Middle Name</div>

                    </div>

                    <table className="table-auto w-full text-xs border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border">#</th>
                                <th className="border">Class Code</th>
                                <th className="border">Subject Code</th>
                                <th className="border">Descriptive Title</th>
                                <th className="border">Lec</th>
                                <th className="border">Lab</th>
                                <th className="border">Credit</th>
                                <th className="border">Day</th>
                                <th className="border">Time</th>
                                <th className="border">Room</th>
                                <th className="border">Instructor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentInfo.student_subject.map((subjects, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-100">
                                    <td className="border text-center">{index + 1}</td>
                                    <td className="border">{subjects.year_section_subjects.class_code}</td>
                                    <td className="border">{subjects.year_section_subjects.subject.subject_code}</td>
                                    <td className="border">{subjects.year_section_subjects.subject.descriptive_title}</td>
                                    <td className="border text-center">{subjects.year_section_subjects.subject.lecture_hours}</td>
                                    <td className="border text-center">{subjects.year_section_subjects.subject.laboratory_hours}</td>
                                    <td className="border text-center">{subjects.year_section_subjects.subject.credit_units}</td>
                                    <td className="border text-center">{subjects.year_section_subjects.day}</td>
                                    <td className="border text-center">{convertToAMPM(subjects.year_section_subjects.start_time)} - {convertToAMPM(subjects.year_section_subjects.end_time)}</td>
                                    <td className="border text-center">{subjects.year_section_subjects.room.room_name}</td>
                                    <td className="border">{formatFullName(subjects.year_section_subjects.user_information)}</td>
                                </tr>
                            ))}
                            {/* Row for total units */}
                            <tr className="bg-gray-200 font-semibold">
                                <td className="border px-4 py-2 text-right" colSpan="4">Total No. of Units:</td>
                                <td className="border px-4 py-2 text-center">
                                    {studentInfo.student_subject.reduce((total, subjects) => total + parseFloat(subjects.year_section_subjects.subject.lecture_hours || 0), 0).toFixed(1)}
                                </td>
                                <td className="border px-4 py-2 text-center">
                                    {studentInfo.student_subject.reduce((total, subjects) => total + parseFloat(subjects.year_section_subjects.subject.laboratory_hours || 0), 0).toFixed(1)}
                                </td>
                                <td className="border px-4 py-2 text-center">
                                    {studentInfo.student_subject.reduce((total, subjects) => total + parseFloat(subjects.year_section_subjects.subject.credit_units || 0), 0).toFixed(1)}
                                </td>
                                <td colSpan="4"></td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="mt-4 text-center text-xs italic text-gray-600">
                        <p>This is a system-generated document and does not require a signature.</p>
                    </div>
                </div>
            </div>
            <button
                onClick={handlePrint}
                className="bg-gray-800 text-white py-2 px-4 rounded w-full text-2xl transition transform active:scale-95"
            >
                Print COR
            </button>
        </div>
    );
}

export default StudentCor;
