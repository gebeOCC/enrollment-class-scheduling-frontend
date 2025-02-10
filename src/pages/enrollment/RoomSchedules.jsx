import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import Schedule from "../Schedule/Schedule";
import PreLoader from "../../components/preloader/PreLoader";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa6";
import { utils, writeFile } from 'xlsx';
import TabularSchedule from "../Schedule/TabularSchedule";
import { convertToAMPM, formatFullName } from "../../utilities/utils";

function RoomSchedules() {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("all");
    const [fetching, setFetching] = useState(true);
    const [colorful, setColorful] = useState(true);
    const [plotting, setPlotting] = useState(true);

    const getEnrollmentRoomSchedules = async () => {
        await axiosInstance.get(`get-enrollment-room-schedules`)
            .then(response => {
                const sortedRooms = response.data.map(room => ({
                    ...room,
                    schedules: room.schedules.sort((a, b) => {
                        const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "TBA"];

                        // Sort by day
                        const dayComparison = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
                        if (dayComparison !== 0) return dayComparison;

                        // Sort by descriptive title
                        const titleComparison = a.descriptive_title.localeCompare(b.descriptive_title);
                        if (titleComparison !== 0) return titleComparison;

                        // Sort by start time
                        return a.start_time.localeCompare(b.start_time);
                    })
                }));

                setRooms(sortedRooms);
            })
            .finally(() => {
                setFetching(false);
            });
    };

    useEffect(() => {
        getEnrollmentRoomSchedules();
    }, []);

    const handleRoomChange = (event) => {
        setSelectedRoom(event.target.value);
    };

    const filteredRooms =
        selectedRoom === "all"
            ? rooms
            : rooms.filter(room => room.id === parseInt(selectedRoom));

    const downloadAllSchedules = () => {
        filteredRooms.forEach((room, index) => {
            const element = document.getElementById(`schedule-${index}`);
            if (element) {
                // Add inline styling for images
                const style = document.createElement("style");
                document.head.appendChild(style);
                style.sheet?.insertRule('body > div:last-child img { display: inline-block; }');

                html2canvas(element, { scale: 5 }).then((canvas) => {
                    const imageUrl = canvas.toDataURL("image/png");
                    const filename = `${room.room_name} (${room.schedules.length} classes).png`;

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
        // Combine the main header and the data
        const fullDataToExport = [...rooms]; // Wrap mainHeader in an array to make it a separate row

        // Convert to worksheet
        const ws = utils.json_to_sheet(fullDataToExport);

        // Set the column widths
        const columnWidths = [
            { wch: 14 }, // Class Code
            { wch: 14 }, // Subject Code
            { wch: 30 }, // Descriptive Title
            { wch: 12 }, // Day
            { wch: 20 }, // Time
            { wch: 12 }, // Room
            { wch: 30 }, // Instructor
        ];

        ws['!cols'] = columnWidths; // Apply the column widths

        // Create a new workbook and append the worksheet
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Classes");

        // File name for download
        const fileName = `rooms.xlsx`;

        writeFile(wb, fileName); // Write the file
    };

    if (fetching) return <PreLoader />;

    return (
        <div className="space-y-4">
            <h1 className="bg-white p-4 rounded-lg overflow-hidden text-center flex flex-col sm:flex-row justify-center items-center text-2xl sm:text-4xl font-bold text-blue-600">
                Rooms
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
                    <option value="all">All Rooms</option>
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                            {room.room_name} ({room.schedules.length} classes)
                        </option>
                    ))}
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

            {filteredRooms.map((room, index) => (
                <div
                    id={`schedule-${index}`} // Unique ID for each room
                    key={index}
                    className="w-full p-4 bg-white rounded-lg space-y-4 border border-gray-300"
                >
                    <h1 className="text-4xl tracking-wide border-b-2 border-gray-300 pb-2">
                        <span className={`${colorful && 'text-blue-700'} font-bold`}>{room.room_name}</span>{" "}
                        <span className="text-gray-800">
                            ({room.schedules.length} classes)
                        </span>
                    </h1>
                    {plotting ? (
                        <Schedule data={room.schedules} colorful={colorful} />
                    ) : (
                        <table className="min-w-full bg-white shadow-md">
                            <thead>
                                <tr className={`w-full ${colorful ? 'bg-cyan-500' : 'bg-gray-500'} text-white text-left`}>
                                    <th className="py-2 px-1 w-32">Class Code</th>
                                    <th className="py-2 px-1">Descriptive Title</th>
                                    <th className="py-2 px-1 w-32">Day</th>
                                    <th className="py-2 px-1 w-48">Time</th>
                                    <th className="py-2 px-1 w-52">Instructor</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {room.schedules.length > 0 ? (
                                    room.schedules.map((room, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <tr
                                                    className={`border-b odd:bg-white even:bg-gray-100 ${colorful ? 'hover:bg-cyan-200' : 'hover:bg-gray-300'}`}
                                                >
                                                    <>
                                                        <td className={`py-2 px-1`}>
                                                            {room.class_code}
                                                        </td>
                                                        <td className={`py-2 px-1 truncate max-w-xs overflow-hidden whitespace-nowrap`}>
                                                            {room.descriptive_title}
                                                        </td>
                                                        <td className={`py-2 px-1`}>
                                                            {room.day}
                                                        </td>
                                                        <td className="py-2 px-1">
                                                            {room.start_time !== "TBA"
                                                                ? convertToAMPM(room.start_time) + ' - ' + convertToAMPM(room.end_time)
                                                                : "TBA"}
                                                        </td>
                                                        <td className={`py-2 px-1 truncate max-w-xs overflow-hidden whitespace-nowrap`}>
                                                            {room?.first_name != null ? (
                                                                <>{formatFullName(room)}</>
                                                            ) : (
                                                                <>TBA</>
                                                            )}
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
                    )}
                </div>
            ))}
        </div>
    );
}

export default RoomSchedules;
