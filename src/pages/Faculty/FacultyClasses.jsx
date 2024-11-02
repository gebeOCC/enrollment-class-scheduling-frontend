import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { Link } from "react-router-dom";
import { convertToAMPM } from "../../utilities/utils";
import { PiSpinnerBold } from "react-icons/pi";

const daysOrder = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 7,
};

function FacultyClasses() {
    const [classes, setClasses] = useState([]);
    const [schoolYear, setSchoolYear] = useState([]);
    const [noSchoolYear, setNoSchoolYear] = useState(false);
    const [fetching, setFetching] = useState(true);

    const sortClassesByDay = (data) => {
        return data.sort((a, b) => daysOrder[a.day] - daysOrder[b.day]);
    };

    useEffect(() => {
        const getClasses = async () => {
            await axiosInstance.get(`get-faculty-classes`)
                .then(response => {
                    if (response.data.message == 'success') {
                        const sortedClasses = sortClassesByDay(response.data.classes);
                        setClasses(sortedClasses);
                        setSchoolYear(response.data.schoolYear);
                        console.log(response.data);
                    } else if (response.data.message == 'no school year') {
                        setNoSchoolYear(true);
                    }
                })
                .finally(() => {
                    setFetching(false);
                })
        }

        getClasses();
    }, [])

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-full text-blue-600">
                <PiSpinnerBold className="animate-spin text-4xl" size={45} />
            </div>
        );
    } else if (noSchoolYear) {
        return (
            <div className="bg-transparent p-4 rounded-lg overflow-hidden text-center flex justify-center items-center h-full">
                <h1 className="text-4xl font-bold text-blue-600">
                    Current School Year not set yet
                </h1>
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
            <div className='bg-white p-4 rounded-lg shadow-lg overflow-hidden'>
                <h1 className="text-2xl font-bold mb-4">Classes <span className="text-sm"></span></h1>
                <table className="w-full bg-white">
                    <thead>
                        <tr className="bg-[#2980b9] text-white">
                            {['Day', 'Subject', 'Time', 'Room', 'Class Section', 'Actions'].map((header) => (
                                <th key={header} className="text-left p-2">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {classes && classes.length > 0 ? (
                            classes.map((classSubject, index) => (
                                <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-[#e1e6ea]"}`}>
                                    <td className="p-2">{classSubject.day}</td>
                                    <td className="p-2">{classSubject.descriptive_title}</td>
                                    <td className="p-2">{`${convertToAMPM(classSubject.start_time)} - ${convertToAMPM(classSubject.end_time)}`}</td>
                                    <td className="p-2">{classSubject.room_name}</td>
                                    <td className="p-2">{`${classSubject.course_name_abbreviation}-${classSubject.year_level}${classSubject.section}`}</td>
                                    <td className="p-2 text-center">
                                        <Link to={`${classSubject.hashed_year_section_subject_id}`}>
                                            <button className="text-white px-2 rounded bg-[#00b6cf] hover:opacity-80 active:opacity-90">
                                                View Students
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="border-b bg-white">
                                <td className="p-2 text-center" colSpan="6">No classes</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default FacultyClasses;