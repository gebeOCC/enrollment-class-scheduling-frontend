import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { Link } from "react-router-dom";
import { convertToAMPM } from "../../utilities/utils";
import PreLoader from "../../components/preloader/PreLoader";
import { FaDownload } from "react-icons/fa";
import html2canvas from "html2canvas";

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

    const captureComponent = () => {
        const element = document.getElementById('classes');

        // Apply styling to ensure images are inline
        const style = document.createElement('style');
        document.head.appendChild(style);
        style.sheet?.insertRule('body > div:last-child img { display: inline-block; }');

        // Fallback to image download logic
        html2canvas(element, { scale: 5 }).then((canvas) => {
            const imageUrl = canvas.toDataURL("image/png");
            const filename = `${schoolYear?.start_year || 'Unknown'}-${schoolYear?.end_year || 'Unknown'} ${schoolYear?.semester_name || 'Unknown'} Semester.png`;

            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = filename;
            link.click();

            style.remove(); // Remove style after image export
        });
    }

    if (fetching) {
        if (fetching) return <PreLoader />
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
        <div className="flex flex-col space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex justify-center items-center w-full">
                <h1 className="text-4xl font-bold text-blue-600">
                    {schoolYear.start_year}-{schoolYear.end_year} {schoolYear.semester_name} Semester
                </h1>
            </div>
            <table id="classes" className="shadow-light text-lg">
                <thead>
                    <tr className="bg-[#2980b9] text-white ">
                        <th className="text-left p-2 w-32">Day</th>
                        <th className="text-left p-2">Subject</th>
                        <th className="text-left p-2 w-52">Time</th>
                        <th className="text-left p-2 w-16">Room</th>
                        {/* <th className="text-left p-2 w-34">Course & Section</th> */}
                        <th className=""></th>
                    </tr>
                </thead>
                <tbody>
                    {classes && classes.length > 0 ? (
                        classes.map((classSubject, index) => (
                            <tr key={index} className={`border-b odd:bg-white even:bg-gray-100`}>
                                <td className="p-2">{classSubject.day}</td>
                                <td className="p-2">{classSubject.descriptive_title}</td>
                                <td className="p-2">{classSubject.start_time == 'TBA' ? 'TBA' : `${convertToAMPM(classSubject.start_time)} - ${convertToAMPM(classSubject.end_time)}`}</td>
                                <td className="p-2">{classSubject.room_name || 'TBA'}</td>
                                {/* <td className="px-4 py-2">{`${classSubject.course_name_abbreviation}-${classSubject.year_level}${classSubject.section}`}</td> */}
                                <td className="px-2 text-center w-36">
                                    <Link to={`${classSubject.hashed_year_section_subject_id}`}>
                                        <button className="text-white px-4 rounded bg-[#00b6cf] hover:opacity-80 active:opacity-90">
                                            View Class
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
    )
}
export default FacultyClasses;