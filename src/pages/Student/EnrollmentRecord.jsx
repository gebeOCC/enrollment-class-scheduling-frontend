import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { PiSpinnerBold } from "react-icons/pi";
import { convertToAMPM, formatFullName } from "../../utilities/utils";

function EnrollmentRecord() {
    const [classes, setClasses] = useState([]);
    const [schoolYear, setSchoolYear] = useState({});
    const [data, setData] = useState(true);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const getEnrollmentRecord = async () => {
            await axiosInstance.get(`get-enrollment-record`)
                .then(response => {
                    if (response.data.message == 'success') {
                        setClasses(response.data.studentClasses);
                        setSchoolYear(response.data.schoolYear);
                    } else if (response.data.message == 'no data') {
                        setSchoolYear(response.data.schoolYear);
                        setData(false);
                    }
                    console.log(response.data)
                })
                .finally(() => {
                    setFetching(false);
                })
        }

        getEnrollmentRecord();
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
                    Enrollment Record
                </h1>
            </div>
            {data ?
                (
                    classes.map((classes, index) => (
                        <div key={index} className='bg-white p-4 rounded-lg shadow-lg overflow-hidden'>
                            <>
                                <h1 className="text-2xl font-bold mb-4">
                                    {classes.year_section.school_year.start_year}-{classes.year_section.school_year.end_year} {classes.year_section.school_year.semester.semester_name} Semester <span className="font-normal">{classes?.year_section?.course?.course_name_abbreviation} - {classes?.year_section?.year_level?.year_level}{classes?.year_section?.section} </span>
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
                                                No data
                                            </>
                                        )
                                        }
                                    </tbody>
                                </table>
                            </>
                        </div>
                    ))
                ) : (

                    <div className='bg-white p-4 rounded-lg shadow-lg overflow-hidden'>
                        <h1 className="text-2xl font-bold"> No data</h1>
                    </div>
                )
            }
        </div >
    )
}

export default EnrollmentRecord;