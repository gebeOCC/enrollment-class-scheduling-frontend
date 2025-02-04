import React from "react";
import { convertToAMPM, formatFullName } from "../../utilities/utils";
import { PiStudent } from "react-icons/pi";

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
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lightgreen-500",
    "bg-green-500",
    "bg-skyblue-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-teal-500",
    "bg-lightred-500",
    "bg-coral-500",
    "bg-darkorange-500",
    "bg-deeppink-500",
    "bg-blueviolet-500",
    "bg-cadetblue-500",
    "bg-chartreuse-500",
    "bg-steelblue-500",
    "bg-chocolate-500",
    "bg-turquoise-500",
    "bg-mediumvioletred-500",
    "bg-olivedrab-500",
];

function Schedule({ data, colorful }) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const timeSlots = Array.from({ length: 27 }, (_, i) => {
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
        return existingSchedules.some((schedule) => {
            // Primary schedule conflict
            const primaryConflict =
                schedule.day === newSchedule.day &&
                newSchedule.start_time < schedule.end_time &&
                newSchedule.end_time > schedule.start_time;

            // Secondary schedule conflict
            const secondarySchedule = schedule.subject_secondary_schedule;
            const secondaryConflict =
                secondarySchedule &&
                secondarySchedule.day === newSchedule.day &&
                newSchedule.start_time < secondarySchedule.end_time &&
                newSchedule.end_time > secondarySchedule.start_time;

            return primaryConflict || secondaryConflict;
        });
    }


    return (
        <div
            className={`grid w-full border-2 border-black grid-cols-[120px_repeat(6,_1fr)] grid-rows-[30px_repeat(${timeSlots.length},_25px)]`}
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
                            {`${convertToAMPM(start).replace(/ AM| PM/g, "")} - ${convertToAMPM(end).replace(/ AM| PM/g, "")}`}
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
                const { id, day, start_time, end_time, descriptive_title, room_name, first_name, class_code, student_count } = classData;
                const rowStart = timeToRowIndex(start_time);
                const rowEnd = timeToRowIndex(end_time);
                const colStart = dayToColumnIndex(day);
                const color = colors[index % colors.length];

                // Check for time conflicts
                const isConflict = hasTimeConflict(
                    data.filter((item) => item.id !== id), // Exclude current item
                    { day, start_time, end_time }
                );

                // Secondary schedule data
                const secondarySchedule = classData.subject_secondary_schedule;
                const secondaryDay = secondarySchedule?.day;
                const secondaryStartTime = secondarySchedule?.start_time;
                const secondaryEndTime = secondarySchedule?.end_time;
                const secondaryRoomName = secondarySchedule?.room_name;

                const secondaryRowStart = secondaryStartTime ? timeToRowIndex(secondaryStartTime) : null;
                const secondaryRowEnd = secondaryEndTime ? timeToRowIndex(secondaryEndTime) : null;
                const secondaryColStart = secondaryDay ? dayToColumnIndex(secondaryDay) : null;

                const secondaryIsConflict = hasTimeConflict(
                    data.filter((item) => item.id !== id),
                    { day: secondaryDay, start_time: secondaryStartTime, end_time: secondaryEndTime }
                );

                if (day == "TBA" || start_time == "TBA") return;

                return (
                    <React.Fragment key={`${class_code}-first-${index}`}>
                        <div
                            className={`${isConflict ? "bg-red-600 bg-opacity-50 text-white" : `${!colorful ? 'bg-white opacity-90 ring-1 ring-gray-400' : `${color}`}`} m-[2px] text-center text-sm flex flex-col items-center justify-center font-medium rounded-md p-1`}
                            style={{
                                gridRow: `${rowStart} / ${rowEnd}`,
                                gridColumn: `${colStart} / ${colStart + 1}`,
                            }}
                        >
                            <span>{class_code || ''}</span>
                            <span>{descriptive_title}</span>
                            <span>{room_name || ""}</span>
                            <span>{first_name ? formatFullName(classData) : ""}</span>
                            {student_count &&
                                <span className="flex items-center justify-center"><PiStudent /> {student_count}</span>
                            }
                        </div>

                        {secondarySchedule && (
                            <div
                                key={`${class_code}-secondary`}
                                className={`${secondaryIsConflict ? "bg-red-600 bg-opacity-50 text-white" : `${!colorful ? 'bg-white opacity-90 ring-1 ring-gray-400' : color}`} m-[2px] text-center text-sm flex flex-col items-center justify-center font-medium rounded-md p-1`}
                                style={{
                                    gridRow: secondaryRowStart && secondaryRowEnd ? `${secondaryRowStart} / ${secondaryRowEnd}` : undefined,
                                    gridColumn: secondaryColStart ? `${secondaryColStart} / ${secondaryColStart + 1}` : undefined,
                                }}
                            >
                                <span>{class_code || ''}</span>
                                <span>{descriptive_title}</span>
                                <span>{secondaryRoomName || ""}</span>
                                <span>{first_name ? formatFullName(classData) : ""}</span>
                                {student_count && 
                                    <span className="flex items-center justify-center"><PiStudent /> {student_count}</span>
                                }
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default Schedule;
