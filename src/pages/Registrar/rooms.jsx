import { useEffect, useState } from "react"
import axiosInstance from "../../../axios/axiosInstance";
import { ImSpinner5 } from "react-icons/im";
import PreLoader from "../../components/preloader/PreLoader";

function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [departmentRooms, setDepartmentsRooms] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
    const [roomName, setRoomName] = useState("")
    const [deptId, setDeptId] = useState("")
    const [roomNameInputEmpty, setRoomNameInputEmpty] = useState(false)
    const [roomExist, setRoomExist] = useState(false)
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        axiosInstance.get(`get-rooms/`)
            .then(response => {
                setRooms(response.data.rooms);
                setDepartmentsRooms(response.data.department)
                console.log(response.data);
            })
            .finally(() => {
                setFetching(false);
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
                setRoomExist(false);
                setRoomName("");
            } else if (response.data.message === "Room already exists") {
                setRoomExist(true);
            }
        } finally {
            setSubmitting(false);
        }
    }

    const [assigningRoom, setAssigningRoom] = useState(false);
    const [roomId, setRoomId] = useState(0);

    const assignRoom = async (id) => {
        setAssigningRoom(true);
        setRoomId(id);
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
            setAssigningRoom(false);
            setRoomId(0);
        }
    }

    const [unAssigningRoom, setUnAssigningRoom] = useState(false);

    const unAssignRoom = async (id) => {
        setUnAssigningRoom(true);
        setRoomId(id);
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
            setUnAssigningRoom(false);
            setRoomId(0);
        }
    }

    if (fetching) return <PreLoader />
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
                                                    style={{ color: '#00FF1A' }}
                                                    onClick={() => { assignRoom(room.id) }}>
                                                    {(assigningRoom && roomId == room.id) ? (
                                                        <ImSpinner5 className="size-6 inline-block animate-spin ml-1" />
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
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
                        className={`w-full md:w-full bg-white p-4 rounded-md shadow-light ${departmentRoom.id == deptId ? 'ring-2 ring-[#00ff1a]' : ''}`}>
                        <div className="flex justify-between mb-4">
                            <h3
                                className="text-black font-bold text-lgcursor-pointer inline-block self-center text-2xl">
                                {departmentRoom.department_name_abbreviation}
                            </h3>

                            {departmentRoom.id == deptId ? (
                                <button
                                    onClick={() => { setDeptId(0) }}
                                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded opacity-75 cursor-pointer">
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
                                <div
                                    key={index}
                                    className="bg-yellow-400 text-black flex justify-between items-center px-3 py-2 rounded-md" style={{ backgroundColor: "#FFC107" }}>
                                    <span style={{ color: "495057" }}>{room.room_name}</span>
                                    <button
                                        style={{ color: "#C82333" }}
                                        onClick={() => { unAssignRoom(room.id) }}>
                                        {(unAssigningRoom && roomId == room.id) ? (
                                            <ImSpinner5 className="size-6 inline-block animate-spin ml-1" />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div >

            {isRoomModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-md w-[300px]">
                        <h2 className="text-lg font-bold mb-4">Add Room</h2>
                        <form>
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-600  absolute left-1 -top-2.5 bg-white px-1">Room Name:</label>
                                <input
                                    type="text"
                                    value={roomName}
                                    name="room_name"
                                    onChange={(e) => { if (submitting) return; setRoomName(e.target.value) }}
                                    className={`w-full px-3 py-2 rounded-md border border-gray-400 focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out ${roomNameInputEmpty && 'border-red-300'}`}
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
                                    {submitting ? (
                                        <>
                                            Saving
                                            <ImSpinner5 className="inline-block animate-spin ml-1" />
                                        </>
                                    ) : (
                                        "Save"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )
            }
        </>
    )
}

export default Rooms