import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import { convertToAMPM } from "../../utilities/utils";
import { capitalizeFirstLetter } from "../../utilities/utils";
import { getFirstLetter } from "../../utilities/utils";
import * as XLSX from 'xlsx'; // Import the xlsx library

function CLassStudents() {
    const { classId } = useParams();
    const [classInfo, setClassinfo] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const getClassStudents = async () => {
            await axiosInstance.get(`get-class-students/${classId}`)
                .then(response => {
                    setClassinfo(response.data.classInfo);
                    setStudents(response.data.students);
                })
        }
        getClassStudents();
    }, []);

    const sortedStudents = [...students].sort((a, b) => {
        if (a.last_name.toLowerCase() < b.last_name.toLowerCase()) return -1;
        if (a.last_name.toLowerCase() > b.last_name.toLowerCase()) return 1;
        return 0;
    });

    // Function to export data to Excel
    const exportToExcel = () => {
        const dataToExport = sortedStudents.map((student, index) => ({
            "#": index + 1,
            "Student ID no.": student.user_id_no,
            "Name": `${capitalizeFirstLetter(student.last_name)}, ${capitalizeFirstLetter(student.first_name)} ${getFirstLetter(student.middle_name)}.`,
            "Email": student.email_address,
            "Course & Year": `${student.course_name_abbreviation}-${student.year_level}${student.section}`,
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport); // Convert JSON to worksheet
        const wb = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(wb, ws, "Class Students"); // Append the worksheet to the workbook

        // Generate the dynamic file name
        const fileName = `${classInfo.subject_code} - ${classInfo.descriptive_title} Students.xlsx`;

        XLSX.writeFile(wb, fileName); // Write the Excel file with the dynamic file name
    };

    return (
        <>
            <section className="bg-white p-6 rounded-lg shadow-light text-center flex justify-center items-center mb-4">
                {classInfo.subject_code && (
                    <div className="grid grid-cols-1 gap-0 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-4 items-center">
                        <h1 className="text-xl font-bold">
                            {classInfo.subject_code}: {classInfo.descriptive_title}
                        </h1>
                        {classInfo.day && <div className="text-lg px-4">{classInfo.day}</div>}
                        {classInfo.start_time && classInfo.end_time && (
                            <div className="text-lg px-4">
                                {convertToAMPM(classInfo.start_time)} - {convertToAMPM(classInfo.end_time)}
                            </div>
                        )}
                        {classInfo.room_name && <div className="text-lg px-4">{classInfo.room_name}</div>}
                    </div>
                )}
            </section>

            <button
                onClick={exportToExcel}
                className="mb-4 p-2 bg-green-500 text-white rounded hover:bg-green-400"
            >
                Export to Excel
            </button>

            <table className="min-w-full bg-white shadow-light text-sm sm:text-lg">
                <thead>
                    <tr className="w-full bg-[#00b6cf] text-white text-left">
                        <th className="py-2 px-4 hidden sm:table-cell">#</th>
                        <th className="py-2 px-4 hidden sm:table-cell">Student ID no.</th>
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Email</th>
                        <th className="py-2 px-4 hidden sm:table-cell">Course & Year</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        sortedStudents.map((student, index) => (
                            <tr key={index} className={`border-b odd:bg-white even:bg-[#deeced]`}>
                                <td className="py-2 px-4 hidden sm:table-cell">{index + 1}</td>
                                <td className="py-2 px-4 hidden sm:table-cell">{student.user_id_no}</td>
                                <td className="py-2 px-4">
                                    {capitalizeFirstLetter(student.last_name)}, {capitalizeFirstLetter(student.first_name)} {getFirstLetter(student.middle_name)}.
                                </td>
                                <td className="py-2 px-4">{student.email_address}</td>
                                <td className="py-2 px-4 hidden sm:table-cell">{student.course_name_abbreviation}-{student.year_level}{student.section}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="py-2 px-4" colSpan="6">No Data</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

export default CLassStudents;
