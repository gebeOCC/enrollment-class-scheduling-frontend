
import OCC_LOGO from '../../images/OCC_LOGO.png';
import { convertToAMPM, formatDate, formatFullName } from '../../utilities/utils';
function CorGenerator({ data }) {
    return (
        <div className="space-y-4 p-5 flex justify-center bg-white w-min rounded-lg">
            <div className="p-5 border border-gray-600 w-[800px] space-y-4">
                <div className="flex items-center justify-center space-x-4">
                    <div className="text-center flex flex-col relative">
                        <img src={OCC_LOGO} alt="Logo" className="h-full absolute -left-40" />
                        <h1 className="text-lg font-bold">OPOL COMMUNITY COLLEGE</h1>
                        <p className="text-sm">Opol, Misamis Oriental</p>
                        <h2 className="text-xl font-bold">CERTIFICATE OF REGISTRATION</h2>
                    </div>
                </div>

                <div className="grid grid-cols-[40px,50px,35px,1px,75px,130px,100px,1fr,85px,80px] gap-x-2 text-xs">
                    <div className="col-span-2 font-bold">Registration No.:</div>
                    <div className="col-span-3 col-start-3 border-b border-gray-900 pl-2">{data.registration_number}</div>

                    <div className="col-span-5"></div>

                    <div className="col-span-2 font-bold">Date Enrolled:</div>
                    <div className="col-span-3 col-start-3 border-b border-gray-900 pl-2">{formatDate(data.date_enrolled)}</div>

                    <div className="col-span-1 font-bold text-end">Semester:</div>
                    <div className="col-span-1 border-b border-gray-900 text-center">{data.year_section.school_year.semester.semester_name}</div>

                    <div className="col-span-1 col-start-9 font-bold">School Year:</div>
                    <div className="col-span-1 border-b border-gray-900 text-center">{data.year_section.school_year.start_year}-{data.year_section.school_year.end_year}</div>

                    <div className="col-span-2 font-bold">Student ID No.:</div>
                    <div className="col-span-3 col-start-3 border-b border-gray-900 pl-2">{data.user.user_id_no}</div>

                    <div className="col-span-1 font-bold text-end">Course & Year:</div>
                    <div className="col-span-1 border-b border-gray-900 text-center">{data.year_section.course.course_name_abbreviation} - {data.year_section.year_level_id}{data.year_section.section}
                    </div>

                    <div className="col-span-1 col-start-9 font-bold">Gender:</div>
                    <div className="col-span-1 border-b border-gray-900 text-center">{data.user.user_information.gender}</div>

                    <div className="col-span-1 font-bold">Name:</div>
                    <div className="col-span-2 border-b border-gray-900 text-center">{data.user.user_information.last_name}</div>
                    ,
                    <div className="col-span-2 col-start-5 border-b border-gray-900 text-center">{data.user.user_information.first_name}</div>
                    <div className="col-span-1 border-b border-gray-900 text-center">{data.user.user_information.middle_name}</div>

                    <div className="col-span-1 col-start-9 font-bold">Student Type:</div>
                    <div className="col-span-1 border-b border-gray-900 text-center">{data.student_type.student_type_name}</div>

                    <div className="col-span-2 text-xs italic col-start-2 text-gray-600 text-center">Last Name</div>
                    <div className="col-span-2 col-start-5  text-xs italic text-gray-600 text-center">First Name</div>
                    <div className="col-span-1 text-xs italic text-gray-600 text-center">Middle Name</div>
                </div>

                <table className="table-auto w-full text-[10px] border-collapse">
                    <thead className="bg-gray-200">
                        {/* Row for main headers */}
                        <tr className="h-5">
                            <th className="border border-r-black" rowSpan="2"></th>
                            <th className="border border-black" rowSpan="2">Class Code</th>
                            <th className="border border-black" rowSpan="2">Subject Code</th>
                            <th className="border border-black" rowSpan="2">Descriptive Title</th>
                            <th className="border border-black" colSpan="3">Units</th>
                            <th className="border border-black" colSpan="3">Schedule</th>
                            <th className="border border-black" rowSpan="2">Instructor</th>
                        </tr>
                        {/* Row for sub-headers */}
                        <tr className="h-5">
                            <th className="border border-black">Lec</th>
                            <th className="border border-black">Lab</th>
                            <th className="border border-black">Credit</th>
                            <th className="border border-black">Day</th>
                            <th className="border border-black">Time</th>
                            <th className="border border-black">Room</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.student_subject.map((subjects, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-100">
                                <td className="border text-center">{index + 1}</td>
                                <td className="border">{subjects.year_section_subjects.class_code}</td>
                                <td className="border">{subjects.year_section_subjects.subject.subject_code}</td>
                                <td className="border">{subjects.year_section_subjects.subject.descriptive_title}</td>
                                <td className="border text-center">{subjects.year_section_subjects.subject.lecture_hours}</td>
                                <td className="border text-center">{subjects.year_section_subjects.subject.laboratory_hours}</td>
                                <td className="border text-center">{subjects.year_section_subjects.subject.credit_units}</td>
                                <td className="border text-center">{subjects.year_section_subjects.day}</td>
                                <td className="border text-center">
                                    {convertToAMPM(subjects.year_section_subjects.start_time)} - {convertToAMPM(subjects.year_section_subjects.end_time)}
                                </td>
                                <td className="border text-center">{subjects.year_section_subjects.room.room_name}</td>
                                <td className="border">{formatFullName(subjects.year_section_subjects.user_information)}</td>
                            </tr>
                        ))}
                        {/* Row for total units */}
                        <tr className="bg-gray-200">
                            <td className="border text-right" colSpan="4">Total No. of Units:</td>
                            <td className="border text-center">
                                {data.student_subject.reduce((total, subjects) => total + parseFloat(subjects.year_section_subjects.subject.lecture_hours || 0), 0).toFixed(1)}
                            </td>
                            <td className="border  text-center">
                                {data.student_subject.reduce((total, subjects) => total + parseFloat(subjects.year_section_subjects.subject.laboratory_hours || 0), 0).toFixed(1)}
                            </td>
                            <td className="border text-center">
                                {data.student_subject.reduce((total, subjects) => total + parseFloat(subjects.year_section_subjects.subject.credit_units || 0), 0).toFixed(1)}
                            </td>
                            <td colSpan="4"></td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-2 text-[8px]">
                    Evaluator: {formatFullName(data.evaluator.evaluator_information)}
                </div>

                <div className="mt-4 text-center text-xs italic text-gray-600">
                    <p>This is a system-generated document and does not require a signature.</p>
                </div>
            </div>
        </div>
    )
}

export default CorGenerator