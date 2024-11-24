import React from "react";
import { convertToAMPM, convertToRgba, formatFullName } from "../../utilities/utils";

// Helper function to convert time to row index
function timeToRowIndex(time) {
    const [hour, minute] = time.split(":").map(Number);
    const startHour = 7; // Starting hour of the schedule
    return (hour - startHour) * 2 + (minute === 30 ? 2 : 1); // No need to add 1 for header
}

// Helper function to map days to column indices
function dayToColumnIndex(day) {
    const dayMap = {
        Monday: 2,
        Tuesday: 3,
        Wednesday: 4,
        Thursday: 5,
        Friday: 6,
        Saturday: 7,
    };
    return dayMap[day] || 0;
}

const colors = [
    "#ffc000",
    "#ffff00",
    "#92d050",
    "#00b050",
    "#00b0f0",
    "#0070c0",
    "#b113bd",
    "#2e9288",
    "#ff5050",
    "#ff7043",
    "#ff8c00",
    "#ff1493",
    "#8a2be2",
    "#5f9ea0",
    "#7fff00",
    "#4682b4",
    "#d2691e",
    "#40e0d0",
    "#c71585",
    "#6b8e23",
];

function Schedule({ data }) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const timeSlots = Array.from({ length: 26 }, (_, i) => {
        const startHour = 7;
        const hour = Math.floor((startHour * 60 + i * 30) / 60);
        const minute = (startHour * 60 + i * 30) % 60;
        const nextHour = Math.floor((startHour * 60 + (i + 1) * 30) / 60);
        const nextMinute = (startHour * 60 + (i + 1) * 30) % 60;

        const formattedStart = `${hour}:${minute.toString().padStart(2, "0")}`;
        if (formattedStart === "7:00") return null; // Skip the 7:00 row

        return `${formattedStart} - ${nextHour}:${nextMinute.toString().padStart(2, "0")}`;
    }).filter(Boolean); // Filter out the null value

    function hasTimeConflict(existingSchedules, newSchedule) {
        return existingSchedules.some(
            (schedule) =>
                schedule.day === newSchedule.day && // Same day
                (newSchedule.start_time < schedule.end_time && newSchedule.end_time > schedule.start_time) // Time overlap
        );
    }

    return (
        <div
            className="grid w-full"
            style={{
                display: "grid",
                gridTemplateColumns: "120px repeat(6, 1fr)", // Time + Mon-Sat
                gridTemplateRows: `30px repeat(${timeSlots.length}, 25px)`, // Header + time slots
                border: "2px solid black",
            }}
        >
            {/* Header Row */}
            <div className="bg-gray-200 font-bold flex items-center justify-center border border-t-0 border-l-0 border-r-black border-b-black">
                Time
            </div>
            {days.map((day) => (
                <div
                    key={day}
                    className="bg-gray-200 font-bold flex items-center justify-center border border-t-0 border-r-0 border-l-black border-b-black"
                >
                    {day}
                </div>
            ))}

            {/* Time Column and Empty Grid */}
            {timeSlots.map((timeSlot, rowIndex) => {
                // Split the time slot into start and end times
                const [start, end] = timeSlot.split(" - ").map((time) => time.trim());

                return (
                    <React.Fragment key={`time-slot-${rowIndex}`}> {/* Unique key added here */}
                        {/* Time Column */}
                        <div
                            key={`time-${rowIndex}`}
                            className="font-medium flex items-center justify-center border border-l-0 border-b-0 border-t-black border-r-black bg-[#fff2cc]"
                            style={{
                                gridColumn: "1 / 2", // Time column
                                gridRow: rowIndex + 2, // Align with rows
                            }}
                        >
                            {start} - {end}
                            {/* {`${convertToAMPM(start).replace(/ AM| PM/g, "")} - ${convertToAMPM(end).replace(/ AM| PM/g, "")}`} */}
                        </div>

                        {/* Placeholder Cells for Days */}
                        {days.map((day, colIndex) => (
                            <div
                                key={`cell-${rowIndex}-${colIndex}`}
                                className={`border border-b-0 border-r-0 flex items-center justify-center  ${day === "Monday" ? "border-l-black" : "border-l-gray-500"
                                    } ${timeSlot === "7:30 - 8:00" ? "border-t-black" : "border-t-gray-500"}`}
                                style={{
                                    gridColumn: `${colIndex + 2} / ${colIndex + 3}`, // Days start after time column
                                    gridRow: rowIndex + 2,
                                    backgroundColor: "white", // Empty cell background
                                }}
                            />
                        ))}
                    </React.Fragment>
                );
            })}

            {/* Schedule Data */}
            {data.map((classData, index) => {
                const { id, day, start_time, end_time, descriptive_title, room_name, first_name, class_code } = classData;
                const rowStart = timeToRowIndex(start_time);
                const rowEnd = timeToRowIndex(end_time);
                const colStart = dayToColumnIndex(day);
                const color = colors[index % colors.length];

                // Check for time conflicts
                const isConflict = hasTimeConflict(
                    data.filter((item) => item.id !== id), // Exclude current item
                    { day, start_time, end_time }
                );

                return (
                    <div
                        key={class_code}
                        className="text-center text-sm flex flex-col items-center justify-center font-medium mt-[2px] ml-[2px] mr-[1px] mb-[1px] rounded-md p-1"
                        style={{
                            gridRow: `${rowStart} / ${rowEnd}`,
                            gridColumn: `${colStart} / ${colStart + 1}`,
                            backgroundColor: isConflict ? "rgba(255, 0, 0, 0.5)" : `${convertToRgba(color, 0.95)}`,
                        }}
                    >
                        <span>{class_code || ''}</span>
                        <span>{descriptive_title}</span>
                        <span>{room_name || ""}</span>
                        <span>{first_name ? formatFullName(classData) : ""}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default Schedule;
