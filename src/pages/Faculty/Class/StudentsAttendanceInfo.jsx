import { useEffect, useState } from "react";
import axiosInstance from "../../../../axios/axiosInstance";
import { formatFullName } from "../../../utilities/utils";

function StudentsAttendanceInfo({ classId }) {
    const [dates, setDates] = useState([]);
    const [students, setStudents] = useState([]);

    const getStudentAttendanceInfo = async () => {
        try {
            const response = await axiosInstance.get(`get-student-attendance-info/${classId}`);
            setDates(response.data.dates);
            setStudents(response.data.students);
        } catch (error) {
            console.error("Error fetching attendance info:", error);
        }
    };

    useEffect(() => {
        getStudentAttendanceInfo();
    }, []);

    // Helper function to get unique dates
    const uniqueDates = [...new Set(dates.map((dateObj) => dateObj.attendance_date))];

    return (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="table-auto w-full text-sm text-gray-700">
                <thead className="bg-cyan-700 text-white uppercase text-xs tracking-wide">
                    <tr>
                        <th className="px-6 py-4 text-left">Name</th>
                        {uniqueDates.map((date) => (
                            <th key={date} className="px-6 py-4 text-left">
                                {date}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {students.map((student, index) => {
                        const studentName = `${index + 1}. ${formatFullName(student)}`;
                        const attendance = student.student_attendance;

                        return (
                            <tr
                                key={student.id}
                                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    } hover:bg-gray-100`}
                            >
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {studentName}
                                </td>
                                {uniqueDates.map((date) => {
                                    const status =
                                        attendance.find(
                                            (att) => att.attendance_date === date
                                        )?.attendance_status || "N/A";
                                    return (
                                        <td
                                            key={date}
                                            className={`px-6 py-4 ${status === "Absent"
                                                ? "text-red-500"
                                                : status === "Late"
                                                    ? "text-yellow-500"
                                                    : status === "Excused"
                                                        ? "text-orange-500"
                                                        : status === "Present"
                                                            ? "text-green-500"
                                                            : "text-black"
                                                }`}
                                        >
                                            {status}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default StudentsAttendanceInfo;
