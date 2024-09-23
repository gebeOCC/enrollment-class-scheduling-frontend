import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import { convertToAMPM } from "../../utilities/utils";
import { capitalizeFirstLetter } from "../../utilities/utils";
import { getFirstLetter } from "../../utilities/utils";

function CLassStudents() {

    const { classId } = useParams();
    const [classInfo, setClassinfo] = useState([]);
    const [students, setStudents] = useState([]);
    useEffect(() => {
        const getClassStudents = async () => {
            await axiosInstance.get(`get-class-students/${classId}`)
                .then(response => {
                    console.log(response.data.classInfo);
                    setClassinfo(response.data.classInfo);
                    console.log(response.data.students);
                    setStudents(response.data.students);
                })
        }
        getClassStudents();

    }, [])
    return (
        <>
            <section className="bg-white p-6 rounded-lg shadow-md mb-6 text-center flex justify-center items-center mb-4">
                {classInfo.subject_code && (
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center">
                        <h1 className="text-xl font-bold">
                            {classInfo.subject_code}: {classInfo.descriptive_title}
                        </h1>

                        {classInfo.day && (
                            <div className="text-lg px-4">
                                {classInfo.day}
                            </div>
                        )}

                        {classInfo.start_time && classInfo.end_time && (
                            <div className="text-lg px-4">
                                {convertToAMPM(classInfo.start_time)} - {convertToAMPM(classInfo.end_time)}
                            </div>
                        )}

                        {classInfo.room_name && (
                            <div className="text-lg px-4">
                                {classInfo.room_name}
                            </div>
                        )}
                    </div>
                )}
            </section>
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="w-full bg-[#00b6cf] text-white text-left">
                        <th className="py-2 px-4">#</th>
                        <th className="py-2 px-4">Student ID no.</th>
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Email</th>
                        <th className="py-2 px-4">Course & Year</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student, index) => (
                            <tr
                                key={index}
                                className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-[#deeced]"}`}
                            >
                                <td className="py-2 px-4">{index + 1}</td>
                                <td className="py-2 px-4">{student.user_id_no}</td>
                                <td className="py-2 px-4">{capitalizeFirstLetter(student.last_name)}, {capitalizeFirstLetter(student.first_name)} {getFirstLetter(student.middle_name)}.</td>
                                <td className="py-2 px-4">{student.email_address}</td>
                                <td className="py-2 px-4">{student.course_name_abbreviation}-{student.year_level}{student.section}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="py-2 px-4" colSpan="6">
                                No Data
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}

export default CLassStudents;