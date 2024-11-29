import { useEffect, useState } from "react";
import ClassDashboard from "./ClassDashboard";
import TakeAttendance from "./TakeAttendance";
import axiosInstance from "../../../../axios/axiosInstance";
import { useParams } from "react-router-dom";
import PreLoader from "../../../components/preloader/PreLoader";
import { convertToAMPM } from "../../../utilities/utils";

function ClassRouter() {
    const { classId } = useParams();
    const [tab, setTab] = useState('Dashboard');
    const [id, setClassId] = useState(0);
    const [fetching, setFetchng] = useState(true);
    const [classInfo, setClassinfo] = useState([]);
    useEffect(() => {
        const getClassId = async () => {
            await axiosInstance.get(`get-class-id/${classId}`)
                .then(response => {
                    setClassId(response.data.classInfo.id)
                    setClassinfo(response.data.classInfo)
                })
                .finally(() => {
                    setFetchng(false);
                })
        }

        getClassId()
    }, [])

    if (fetching) return < PreLoader />

    if(!id) return <>Class not found</>

    return (
        <>
            <section className="bg-white p-2 rounded-lg shadow-light text-center flex justify-center items-center mb-4">
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
            {/* Header Section */}
            <div className="w-full shadow-light flex gap-6 px-4 py-2 bg-white">
                {/* Dashboard Tab */}
                <div
                    onClick={() => setTab('Dashboard')}
                    className={`cursor-pointer text-lg font-semibold ${tab === 'Dashboard'
                        ? 'text-cyan-600 border-b-2 border-cyan-600'
                        : 'text-gray-600 hover:text-cyan-600'
                        }`}
                >
                    Dashboard
                </div>
                {/* Take Attendance Tab */}
                <div
                    onClick={() => setTab('Take Attendance')}
                    className={`cursor-pointer text-lg font-semibold ${tab === 'Take Attendance'
                        ? 'text-cyan-600 border-b-2 border-cyan-600'
                        : 'text-gray-600 hover:text-cyan-600'
                        }`}
                >
                    Take Attendance
                </div>
            </div>

            {/* Content Section */}
            <div className="pt-4">
                {tab === 'Dashboard' && <ClassDashboard />}
                {tab === 'Take Attendance' && <TakeAttendance classId={id} />}
            </div>
        </>
    );
}

export default ClassRouter;
