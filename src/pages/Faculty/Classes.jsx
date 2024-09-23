import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { Link } from "react-router-dom";
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

function Classes() {
    const [classes, setClasses] = useState([]);

    const sortClassesByDay = (data) => {
        return data.sort((a, b) => daysOrder[a.day] - daysOrder[b.day]);
    };

    useEffect(() => {
        const getClasses = async () => {
            await axiosInstance.get(`get-faculty-classes`)
                .then(response => {
                    const sortedClasses = sortClassesByDay(response.data);
                    setClasses(sortedClasses);
                    console.log(response.data);
                })
        }

        getClasses();
    }, [])
    return (
        <>
            <div className='bg-white p-4 rounded-lg shadow-lg overflow-hidden'>
                <h1 className="text-2xl font-bold mb-4">Classes</h1>
                <table className="w-full bg-white">
                    <thead>
                        <tr className="bg-[#2980b9] text-white">
                            {['Day', 'Subject', 'Time', 'Room', 'Class Section', 'Actions'].map((header) => (
                                <th key={header} className="text-left p-2">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {classes && classes.map((classSubject, index) => (
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
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
export default Classes;