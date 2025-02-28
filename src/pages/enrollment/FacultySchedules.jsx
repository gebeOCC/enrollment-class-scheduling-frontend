import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import Schedule from "../Schedule/Schedule";
import PreLoader from "../../components/preloader/PreLoader";
import { convertToAMPM, formatFullName } from "../../utilities/utils";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa";
import TabularSchedule from "../Schedule/TabularSchedule";
import { PiStudent } from "react-icons/pi";

function FacultySchedules() {
    const [faculties, setFaculties] = useState([]);
    const [facultiesTabular, setFacultiesTabular] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState("all"); // Default to "all"
    const [fetching, setFetching] = useState(true);
    const [colorful, setColorful] = useState(true);
    const [plotting, setPlotting] = useState(true);

    const getEnrollmentRoomSchedules = async () => {
        await axiosInstance.get(`get-enrollment-faculty-schedules`)
            .then(response => {
                setFaculties(response.data);
                // Transform faculty data
                const transformedFaculties = response.data.map(faculty => {
                    return {
                        ...faculty,
                        schedules: faculty.schedules.flatMap(schedule => {
                            const mainSchedule = { ...schedule, subject_secondary_schedule: undefined }; // Remove nested secondary schedule

                            if (schedule.subject_secondary_schedule) {
                                const secondarySchedule = {
                                    ...schedule.subject_secondary_schedule,
                                    descriptive_title: schedule.descriptive_title,
                                    subject_id: schedule.subject_id,
                                    class_code: schedule.class_code,
                                    faculty_id: schedule.faculty_id, // Assign the same faculty
                                    school_year_id: schedule.school_year_id,
                                    student_count: schedule.student_count,
                                    year_section_id: schedule.year_section_id
                                };
                                return [mainSchedule, secondarySchedule];
                            }
                            return [mainSchedule];
                        })
                    };
                });
                
                const sorterFacultySched = transformedFaculties.map(faculty => ({
                    ...faculty,
                    schedules: faculty.schedules.sort((a, b) => {
                        const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "TBA"];

                        // Sort by day
                        const dayComparison = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
                        if (dayComparison !== 0) return dayComparison;


                        // Sort by start time
                        return a.start_time.localeCompare(b.start_time);
                    })
                }));
                setFacultiesTabular(sorterFacultySched);
            })
            .finally(() => {
                setFetching(false);
            });
    };

    useEffect(() => {
        getEnrollmentRoomSchedules();
    }, []);

    const handleRoomChange = (event) => {
        setSelectedFaculty(event.target.value);
    };

    const filteredFaculties =
        selectedFaculty === "all"
            ? faculties
            : faculties.filter(faculty => faculty.id === parseInt(selectedFaculty));


    const filteredFacultiesTabular =
        selectedFaculty === "all"
            ? facultiesTabular
            : facultiesTabular.filter(faculty => faculty.id === parseInt(selectedFaculty));

    const downloadAllSchedules = () => {
        filteredFaculties.forEach((faculty, index) => {
            const element = document.getElementById(`schedule-${index}`);
            if (element) {
                // Add inline styling for images
                const style = document.createElement("style");
                document.head.appendChild(style);
                style.sheet?.insertRule('body > div:last-child img { display: inline-block; }');

                html2canvas(element, { scale: 5 }).then((canvas) => {
                    const imageUrl = canvas.toDataURL("image/png");
                    const filename = `${formatFullName(faculty)} (${faculty.schedules.length} classes).png`;

                    const link = document.createElement("a");
                    link.href = imageUrl;
                    link.download = filename;
                    link.click();

                    style.remove(); // Remove style after image export
                });
            }
        });
    };

    const exportToExcel = () => {
        console.log('ge export sa excel')
    };

    if (fetching) return <PreLoader />;

    return (
        <div className="space-y-4">
            <h1 className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex flex-col sm:flex-row justify-center items-center text-2xl sm:text-4xl font-bold text-blue-600">
                Faculties
            </h1>
            <div className="flex gap-4">
                <div className='flex shadow-sm rounded-md'>
                    {/* View Mode Selection */}
                    <button
                        onClick={() => setPlotting(false)}
                        className={`border-y border-l w-28 p-2 rounded-l-md ${!plotting
                            ? 'bg-white text-blue-700 underline'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-300'
                            }`}
                    >
                        Tabular
                    </button>
                    <button
                        onClick={() => setPlotting(true)}
                        className={`border-y border-r w-28 p-2 rounded-r-md ${plotting
                            ? 'bg-white text-blue-700 underline'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-300'
                            }`}
                    >
                        Timetable
                    </button>
                </div>
                <select
                    onChange={handleRoomChange}
                    className="min-h-max shadow-sm max-w-max flex-1 p-2 hover:border-blue-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                >
                    <option value="all">All Faculties</option>
                    {faculties.map(faculty => {
                        const secondaryCount = faculty.schedules.reduce((count, schedule) => {
                            return count + (schedule.subject_secondary_schedule ? 1 : 0);
                        }, 0);

                        return (
                            <option key={faculty.id} value={faculty.id}>
                                {formatFullName(faculty)} ({faculty.schedules.length + secondaryCount})
                            </option>
                        );
                    })}
                </select>
                <button
                    onClick={exportToExcel}
                    className="h-min flex gap-2 shadow-lg bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 transition-all duration-200"
                >
                    <FaDownload className="text-xl" />
                    Excel
                </button>
                <button
                    onClick={downloadAllSchedules}
                    className="h-min flex gap-2 shadow-lg bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-200"
                >
                    <FaDownload className="text-xl" />
                    Image
                </button>

                <button className={`self-center mb-1 bg-white border border-gray-300 flex items-center gap-1 rounded-md transition-all duration-200 w-max h-min `}>
                    <input
                        id="colorful"
                        type="checkbox"
                        checked={colorful}
                        onChange={(e) => {
                            setColorful(e.target.checked);
                        }}
                        className={`
                                                ml-2
                                                cursor-pointer 
                                                h-4 w-4 
                                                appearance-none
                                                border border-gray-500 rounded-md 
                                                checked:bg-white checked:border-blue-500
                                                checked:after:content-['✔']
                                                checked:after:text-blue-500 
                                                checked:after:font-bold
                                                flex items-center justify-center
                                                `}
                    />

                    <label
                        htmlFor="colorful"
                        className={`cursor-pointer text-black font-medium py-1 pr-2`}
                    >
                        Color
                    </label>
                </button>
            </div>

            {plotting && filteredFaculties.map((faculty, index) => {
                const secondaryCount = faculty.schedules.reduce((count, schedule) => {
                    return count + (schedule.subject_secondary_schedule ? 1 : 0);
                }, 0);
                return (
                    <div
                        id={`schedule-${index}`}
                        key={index}
                        className="w-full p-4 bg-white rounded-lg shadow-light space-y-4 border border-gray-200"
                    >
                        <h1
                            className="text-4xl tracking-wide border-b-2 border-gray-300 pb-2"
                        >
                            <span className={`${colorful && 'text-blue-700'} font-bold`}> {formatFullName(faculty)}</span> <span className="text-gray-800 "> ({faculty.schedules.length + secondaryCount} classes)</span>

                        </h1>
                        <Schedule data={faculty.schedules} colorful={colorful} />
                    </div>
                )
            })}

            {!plotting && filteredFacultiesTabular.map((faculty, index) => {
                const secondaryCount = faculty.schedules.reduce((count, schedule) => {
                    return count + (schedule.subject_secondary_schedule ? 1 : 0);
                }, 0);
                return (
                    <div
                        id={`schedule-${index}`}
                        key={index}
                        className="w-full p-4 bg-white rounded-lg shadow-light space-y-4 border border-gray-200"
                    >
                        <h1
                            className="text-4xl tracking-wide border-b-2 border-gray-300 pb-2"
                        >
                            <span className={`${colorful && 'text-blue-700'} font-bold`}> {formatFullName(faculty)}</span> <span className="text-gray-800 "> ({faculty.schedules.length + secondaryCount} classes)</span>
                        </h1>
                        <table className="min-w-full bg-white shadow-md">
                            <thead>
                                <tr className={`w-full ${colorful ? 'bg-cyan-500' : 'bg-gray-500'} text-white text-left`}>
                                    <th className="py-2 px-1 w-32">Class Code</th>
                                    <th className="py-2 px-1">Descriptive Title</th>
                                    <th className="py-2 px-1 w-32">Day</th>
                                    <th className="py-2 px-1 w-48">Time</th>
                                    <th className="py-2 px-1 w-32">Room</th>
                                    <th className="py-2 px-1 w-24">Students</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faculty.schedules.length > 0 ? (
                                    faculty.schedules.map((classData, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <tr
                                                    className={`border-b odd:bg-white even:bg-gray-100 ${colorful ? 'hover:bg-cyan-200' : 'hover:bg-gray-300'}`}
                                                >
                                                    <>
                                                        <td className={`py-2 px-1`}>
                                                            {classData.class_code}
                                                        </td>
                                                        <td className={`py-2 px-1 truncate max-w-xs overflow-hidden whitespace-nowrap`}>
                                                            {classData.descriptive_title}
                                                        </td>
                                                        <td className={`py-2 px-1`}>
                                                            {classData.day}
                                                        </td>
                                                        <td className="py-2 px-1">
                                                            {classData.start_time !== "TBA"
                                                                ? convertToAMPM(classData.start_time) + ' - ' + convertToAMPM(classData.end_time)
                                                                : "TBA"}
                                                        </td>
                                                        <td className={`py-2 px-1 truncate max-w-xs overflow-hidden whitespace-nowrap`}>
                                                            {classData.room_name || 'TBA'}
                                                        </td>
                                                        <td className={`py-2 px-1 truncate max-w-xs overflow-hidden whitespace-nowrap flex items-center`}>
                                                            <PiStudent /> {classData.student_count}
                                                        </td>
                                                    </>
                                                </tr>
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td className="py-2 px-4" colSpan="6">
                                            No Data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table >
                    </div>
                )
            })}
        </div>
    );
}

export default FacultySchedules;
