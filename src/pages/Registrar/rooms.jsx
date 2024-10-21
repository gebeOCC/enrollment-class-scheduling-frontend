import { useEffect, useState } from "react"
import axiosInstance from "../../../axios/axiosInstance";

function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [departmentRooms, setDepartmentsRooms] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
    const [roomName, setRoomName] = useState("")
    const [deptId, setDeptId] = useState("")
    const [roomNameInputEmpty, setRoomNameInputEmpty] = useState(false)
    const [roomExist, setRoomExist] = useState(false)

    useEffect(() => {
        axiosInstance.get(`get-rooms/`)
            .then(response => {
                setRooms(response.data.rooms);
                setDepartmentsRooms(response.data.department)
                console.log(response.data);
            });
    }, [])

    const submitRoom = async () => {
        setSubmitting(true)

        if (roomName === "") {
            setRoomNameInputEmpty(true);
            setSubmitting(false)
            return;
        } else {
            setRoomNameInputEmpty(false);
        }

        try {
            const response = await axiosInstance.post(`add-room/`, { room_name: roomName });
            console.log(response.data)
            if (response.data.message === "success") {
                setRooms(response.data.rooms);
                setRoomName("");
            } else if (response.data.message === "Room already exists") {
                setRoomExist(true)
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
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:h-full">
                <div className="w-full md:w-full bg-white shadow-light p-4 rounded-md flex flex-col min-h-min max-h-full">
                    <div className="flex flex-col h-full">
                        <h2 className="text-black font-bold text-2xl mb-2">Rooms</h2>
                        <div className="flex-grow overflow-y-auto space-y-2">
                            {rooms.map((room, index) => (
                                <div key={index} className="bg-blue-500 text-white flex justify-between items-center px-3 py-2 rounded-md">
                                    <span>{room.room_name}</span>
                                    <span className="text-xs">{room.department_name_abbreviation}</span>
                                    {room.department_name_abbreviation ? (
                                        <button style={{ color: '#1ea38d' }} className="cursor-not-allowed">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <>
                                            {deptId ? (
                                                <button
                                                    disabled={submitting}
                                                    style={{ color: '#00FF1A' }}
                                                    onClick={() => { assignRoom(room.id) }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            ) : (
                                                <button style={{ color: '#1ea38d' }} className="cursor-not-allowed">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            className="bg-blue-700 text-white w-full py-2 rounded-md mt-2"
                            onClick={() => { setIsRoomModalOpen(true) }}>
                            Add Room
                        </button>
                    </div>
                </div>

                {departmentRooms.map((departmentRoom, index) => (
                    <div
                        key={index}
                        className={`w-full md:w-full bg-white p-4 rounded-md shadow-light ${departmentRoom.id == deptId ? 'border border-[#00ff1a]' : ''}`}>
                        <div className="flex justify-between mb-4">
                            <h3
                                className="text-black font-bold text-lgcursor-pointer inline-block self-center text-2xl">
                                {departmentRoom.department_name_abbreviation}
                            </h3>

                            {departmentRoom.id == deptId ? (
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded opacity-75 cursor-not-allowed">
                                    Selected
                                </button>
                            ) : (
                                <button
                                    onClick={() => { setDeptId(departmentRoom.id) }}
                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-150 ease-in-out">
                                    Select
                                </button>
                            )}
                        </div>


                        <div className="space-y-2">
                            {departmentRoom.room.map((room, index) => (
                                <div key={index} className="bg-yellow-400 text-black flex justify-between items-center px-3 py-2 rounded-md" style={{ backgroundColor: "#FFC107" }}>
                                    <span style={{ color: "495057" }}>{room.room_name}</span>
                                    <button
                                        disabled={submitting}
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

            {isRoomModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md w-[300px]">
                        <h2 className="text-lg font-bold mb-4">Add Room</h2>
                        <form>
                            <div>
                                <label className="block text-gray-700">Name:</label>
                                <input
                                    type="text"
                                    value={roomName}
                                    name="room_name"
                                    onChange={(e) => { if (submitting) return; setRoomName(e.target.value) }}
                                    className={`w-full px-3 py-2 border rounded-md ${roomNameInputEmpty && 'border-red-300'}`}
                                    placeholder="Room Name"
                                />
                            </div>
                            {roomExist &&
                                <p className="text-sm text-red-500">Room already exists</p>
                            }
                            <div className="flex justify-end mt-4">
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