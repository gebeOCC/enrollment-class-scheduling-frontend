import { useEffect, useState } from "react"
import axiosInstance from "../../../axios/axiosInstance";

function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [departmentRooms, setDepartmentsRooms] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
    const [roomName, setRoomName] = useState("")
    const [deptId, setDeptId] = useState("")

    useEffect(() => {
        axiosInstance.get(`get-rooms/`)
            .then(response => {
                setRooms(response.data.rooms);
                setDepartmentsRooms(response.data.department)
                console.log(response.data);
            });
    }, [])

    const submitRoom = async () => {
        // console.log(roomName)
        setSubmitting(true)
        try {
            const response = await axiosInstance.post(`add-room/`, { room_name: roomName });
            console.log(response.data)
            if (response.data.message === "success") {
                setRooms(response.data.rooms);
                setRoomName("");
            }
        } finally {
            setSubmitting(false);
        }
    }

    const assignRoom = async (id) => {
        console.log(id)
        setSubmitting(true)
        try {
            const response = await axiosInstance.post(`assign-room/`, { roomId: id, departmentId: deptId });
            console.log(response.data)
            if (response.data.message === "success") {
                setIsRoomModalOpen(false);
                setRooms(response.data.rooms);
                setDepartmentsRooms(response.data.department)
            }
        } finally {
            setSubmitting(false);
        }
    }

    const unAssignRoom = async (id) => {
        console.log(id)
        setSubmitting(true)
        try {
            const response = await axiosInstance.post(`unassign-room/${id}`);
            console.log(response.data)
            if (response.data.message === "success") {
                setIsRoomModalOpen(false);
                setRooms(response.data.rooms);
                setDepartmentsRooms(response.data.department)
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <div className="flex gap-4">
                <div className="w-[250px] bg-white shadow-custom-light p-4 rounded-md h-fit">
                    <h2 className="text-black font-bold text-2xl mb-4">Rooms</h2>
                    <div className="space-y-2 h-[75vh] max-h-[75vh] overflow-y-auto">
                        {rooms.map((room, index) => (
                            <div key={index} className="bg-blue-500 text-white flex justify-between items-center px-3 py-2 rounded-md">
                                <span>{room.room_name}</span>
                                <span className="text-xs">{room.department_name_abbreviation}</span>
                                {room.department_name_abbreviation ?
                                    <button style={{ color: '#1ea38d' }} className="cursor-not-allowed">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    :
                                    <>
                                        {deptId ?
                                            <button
                                                style={{ color: '#00FF1A' }}
                                                onClick={() => { assignRoom(room.id) }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            :
                                            <button style={{ color: '#1ea38d' }} className="cursor-not-allowed">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        }
                                    </>
                                }
                            </div>
                        ))}
                    </div>
                    <button
                        className="mt-4 bg-blue-700 text-white w-full py-2 rounded-md"
                        onClick={() => { setIsRoomModalOpen(true) }}>Add Room</button>
                </div>

                <div className="flex gap-4 overflow-x-auto">
                    {departmentRooms.map((departmentRoom, index) => (
                        <div
                            key={index}
                            className={`w-[220px] bg-white p-4 rounded-md shadow-custom-light ${departmentRoom.id == deptId ? 'border-2 border-[#00ff1a]' : ''}`}>
                            <h3
                                onClick={() => { setDeptId(departmentRoom.id) }}
                                className="text-black font-bold text-lg mb-4 cursor-pointer">
                                {departmentRoom.department_name_abbreviation}
                            </h3>
                            <div className="space-y-2">
                                {departmentRoom.room.map((room, index) => (
                                    <div key={index} className="bg-yellow-400 text-black flex justify-between items-center px-3 py-2 rounded-md" style={{ backgroundColor: "#FFC107" }}>
                                        <span style={{ color: "495057" }}>{room.room_name}</span>
                                        <button
                                            style={{ color: "#C82333" }}
                                            onClick={() => { unAssignRoom(room.id) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isRoomModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md w-[300px]">
                        <h2 className="text-lg font-bold mb-4">Add Room</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700">Name:</label>
                                <input
                                    type="text"
                                    value={roomName}
                                    name="room_name"
                                    onChange={(e) => { setRoomName(e.target.value) }}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Room Name"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-thirdColor text-white py-1 px-3 rounded-md mr-2"
                                    onClick={() => { setIsRoomModalOpen(false) }}
                                >
                                    Close
                                </button>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="bg-primaryColor text-white py-1 px-3 rounded-md"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        submitRoom();
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default Rooms