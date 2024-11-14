import { convertToAMPM, formatFullName } from "../../utilities/utils"

function ScheduleGenerator({ data }) {
    return (
        <div key={data.id} id="Schedule" className="bg-white p-4 rounded-lg w-[1080px] space-y-4">
            <h1 className="text-3xl font-semibold text-gray-800 flex items-center space-x-3">
                <span className="text-[#2980b9]">
                    {data.year_section.school_year.start_year}-{data.year_section.school_year.end_year}
                </span>
                <span className="text-gray-600 font-normal">
                    {data.year_section.school_year.semester.semester_name} Semester
                </span>
                <div className="flex items-center justify-center text-sm text-gray-500">
                    <span className="mx-2 font-semibold">|</span>
                    <span>
                        {data?.year_section?.course?.course_name_abbreviation} -
                        {data?.year_section?.year_level?.year_level}{data?.year_section?.section}
                    </span>
                </div>
            </h1>
            <table className="w-full table-auto bg-white rounded-lg shadow-md overflow-hidden">
                <thead>
                    <tr className="bg-[#2980b9] text-white">
                        {['Class Section', 'Subject Code', 'Descriptive Title', 'Credit Units', 'Day', 'Time', 'Room', 'Instructor'].map((header) => (
                            <th key={header} className="text-left py-3 px-4 text-sm font-semibold">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.student_subject && data.student_subject.length > 0 ? (
                        data.student_subject.map((classSubject, index) => (
                            <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-[#f5f8fa]"} hover:bg-[#dbe4e8]`}>
                                <td className="py-3 px-1 text-sm">{classSubject.year_section_subjects.class_code}</td>
                                <td className="py-3 px-1 text-sm">{classSubject.year_section_subjects.subject.subject_code}</td>
                                <td className="py-3 px-1 text-sm">{classSubject.year_section_subjects.subject.descriptive_title}</td>
                                <td className="py-3 px-1 text-sm">{classSubject.year_section_subjects.subject.credit_units}</td>
                                <td className="py-3 px-1 text-sm">{classSubject.year_section_subjects.day}</td>
                                <td className="py-3 px-1 text-sm">{`${convertToAMPM(classSubject.year_section_subjects.start_time)} - ${convertToAMPM(classSubject.year_section_subjects.end_time)}`}</td>
                                <td className="py-3 px-1 text-sm">{classSubject.year_section_subjects.room.room_name}</td>
                                <td className="py-3 px-1 text-sm">{formatFullName(classSubject.year_section_subjects.user_information)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center py-4 text-gray-600">No class</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default ScheduleGenerator