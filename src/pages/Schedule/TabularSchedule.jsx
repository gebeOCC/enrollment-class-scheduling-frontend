import React from "react";
import { convertToAMPM, formatFullName } from "../../utilities/utils";
function TabularSchedule({ data }) {
    
    return (
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
                {data.schedules.length > 0 ? (
                    data.schedules.map((classData, index) => {
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
                                            {classData?.first_name != null ? (
                                                <>{formatFullName(classData)}</>
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
    )
}

export default TabularSchedule