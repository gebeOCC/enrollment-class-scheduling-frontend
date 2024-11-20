import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import PreLoader from "../../components/preloader/PreLoader";
import Schedule from "../Schedule/Schedule";

function SchoolYearRoomSchedule() {
    const [rooms, setRooms] = useState([]);
    const { schoolYear } = useParams();
    const { semester } = useParams();
    const [selectedRoom, setSelectedRoom] = useState("all"); // Default to "all"
    const [fetching, setfetching] = useState(true);

    useEffect(() => {
        const schoolRoomSchedules = async () => {
            await axiosInstance.get(`get-school-year-room-schedules/${schoolYear}/${semester}`)
                .then(response => {
                    console.log(response.data);
                    setRooms(response.data);
                })
                .finally(() => {
                    setfetching(false);
                })
        }
        schoolRoomSchedules()
    }, [])

    const handleRoomChange = (event) => {
        setSelectedRoom(event.target.value);
    };

    const filteredRooms =
        selectedRoom === "all"
            ? rooms
            : rooms.filter(room => room.id === parseInt(selectedRoom));


    if (fetching) return <PreLoader />

    return(
        <div className="space-y-4">
            <h1 className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex flex-col sm:flex-row justify-center items-center text-2xl sm:text-4xl font-bold text-blue-600">
                Rooms
            </h1>
            <div className="bg-white shadow-light px-4 py-2 rounded-md w-1/2">
                <div className="text-2xl flex gap-2 items-center text-center">
                    Filter:
                    <select
                        onChange={handleRoomChange}
                        className="w-full p-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    >
                        <option value="all">All Rooms</option>
                        {rooms.map((room, index) => (
                            <option key={index} value={room.id}>
                                {room.room_name} ({room.schedules.length} classes)
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredRooms.map((room, index) => (
                <div
                    key={index}
                    className="w-full p-4 bg-white rounded-lg shadow-light space-y-4 border border-gray-200"
                >
                    <h1
                        className="text-4xl tracking-wide border-b-2 border-gray-300 pb-2"
                    >
                        <span className="text-blue-700 font-bold">{room.room_name}</span> <span className="text-gray-800 ">({room.schedules.length} classes)</span>
                    </h1>
                    <Schedule data={room.schedules} />
                </div>
            ))}
        </div>
    )
}

export default SchoolYearRoomSchedule