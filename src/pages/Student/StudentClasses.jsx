import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { convertToAMPM } from "../../utilities/utils";

const daysOrder = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 7,
};

function StudentClasses() {
    const [classes, setClasses] = useState([]);
    const [schoolYear, setSchoolYear] = useState([]);

    const sortClassesByDay = (data) => {
        return data.sort((a, b) => daysOrder[a.day] - daysOrder[b.day]);
    };

    const getStudentClasses = async () => {
        await axiosInstance.get(`get-student-classes`)
            .then(response => {
                const sortedClasses = sortClassesByDay(response.data.studentClasses);
                setClasses(sortedClasses);
                setSchoolYear(response.data.schoolYear)
                console.log(response.data);
            })
    }
    useEffect(() => {
        getStudentClasses();
    }, [])

    return (
        <>
            <div className='bg-white p-4 rounded-lg shadow-lg overflow-hidden'>
                <h1 className="text-2xl font-bold mb-4">Classes {schoolYear.school_year} {schoolYear.semester_name} semester</h1>
                <table className="w-full bg-white">
                    <thead>
                        <tr className="bg-[#2980b9] text-white">
                            {['Class Section', 'Subject Code', 'Descriptive Title', 'Credit Units', 'Day', 'Time', 'Room', 'Instructor'].map((header) => (
                                <th key={header} className="text-left p-2">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((classSubject, index) => (
                            <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-[#e1e6ea]"}`}>
                                <td className="p-2">{classSubject.class_code}</td>
                                <td className="p-2">{classSubject.subject_code}</td>
                                <td className="p-2">{classSubject.descriptive_title}</td>
                                <td className="p-2">{classSubject.credit_units}</td>
                                <td className="p-2">{classSubject.day}</td>
                                <td className="p-2">{`${convertToAMPM(classSubject.start_time)} - ${convertToAMPM(classSubject.end_time)}`}</td>
                                <td className="p-2">{classSubject.room_name}</td>
                                <td className="p-2">{classSubject.last_name}, {classSubject.first_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default StudentClasses;