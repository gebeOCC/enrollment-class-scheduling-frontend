import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { convertToAMPM, formatFullName } from "../../utilities/utils";
import { PiSpinnerBold } from "react-icons/pi";

function StudentClasses() {
    const [classes, setClasses] = useState([]);
    const [schoolYear, setSchoolYear] = useState({});
    const [enrolled, setEnrolled] = useState(true);
    const [fetching, setFetching] = useState(true);

    const getStudentClasses = async () => {
        await axiosInstance.get(`get-student-classes`)
            .then(response => {
                if (response.data.message == 'success') {
                    setClasses(response.data.studentClasses);
                    setSchoolYear(response.data.schoolYear);
                } else if (response.data.message == 'not enrorlled') {
                    setSchoolYear(response.data.schoolYear);
                    setEnrolled(false);
                }
            })
            .finally(() => {
                setFetching(false);
            })
    }
    useEffect(() => {
        getStudentClasses();
    }, [])

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-full text-blue-600">
                <PiSpinnerBold className="animate-spin text-4xl" size={45} />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex justify-center items-center">
                <h1 className="text-4xl font-bold text-blue-600">
                    ({schoolYear.start_year}-{schoolYear.end_year} {schoolYear.semester_name} Semester)
                </h1>
            </div>
            <div className='bg-white p-4 rounded-lg shadow-light overflow-hidden'>
                {enrolled ?
                    (
                        <>
                            <h1 className="text-2xl font-bold mb-4">
                                {classes?.year_section?.course?.course_name_abbreviation} - {classes?.year_section?.year_level?.year_level}{classes?.year_section?.section}
                            </h1>
                            <table className="w-full bg-white">
                                <thead>
                                    <tr className="bg-[#2980b9] text-white">
                                        {['Class Section', 'Subject Code', 'Descriptive Title', 'Credit Units', 'Day', 'Time', 'Room', 'Instructor'].map((header) => (
                                            <th key={header} className="text-left p-2">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {classes.student_subject && classes.student_subject.length > 0 ? (
                                        classes.student_subject.map((classSubject, index) => (
                                            <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-[#e1e6ea]"}`}>
                                                <td className="p-2">{classSubject.year_section_subjects.class_code}</td>
                                                <td className="p-2">{classSubject.year_section_subjects.subject.subject_code}</td>
                                                <td className="p-2">{classSubject.year_section_subjects.subject.descriptive_title}</td>
                                                <td className="p-2">{classSubject.year_section_subjects.subject.credit_units}</td>
                                                <td className="p-2">{classSubject.year_section_subjects.day}</td>
                                                <td className="p-2">{`${convertToAMPM(classSubject.year_section_subjects.start_time)} - ${convertToAMPM(classSubject.year_section_subjects.end_time)}`}</td>
                                                <td className="p-2">{classSubject.year_section_subjects.room.room_name}</td>
                                                <td className="p-2">{formatFullName(classSubject.year_section_subjects.user_information)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <>
                                            No class
                                        </>
                                    )
                                    }
                                </tbody>
                            </table>
                        </>) : (
                        <h1 className="text-2xl font-bold"> Not enrolled</h1>
                    )
                }
            </div>
        </div >
    )
}

export default StudentClasses;