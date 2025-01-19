import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import Schedule from "../Schedule/Schedule";
import PreLoader from "../../components/preloader/PreLoader";
import { formatFullNameFML } from "../../utilities/utils";

function FacultySchedules() {
    const [faculties, setFaculties] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("all"); // Default to "all"
    const [fetching, setFetching] = useState(true);

    const getEnrollmentRoomSchedules = async () => {
        await axiosInstance.get(`get-enrollment-faculty-schedules`)
            .then(response => {
                console.log(response.data);
                setFaculties(response.data);
            })
            .finally(() => {
                setFetching(false);
            });
    };

    useEffect(() => {
        getEnrollmentRoomSchedules();
    }, []);

    const handleRoomChange = (event) => {
        setSelectedRoom(event.target.value);
    };

    const filteredFaculties =
        selectedRoom === "all"
            ? faculties
            : faculties.filter(room => room.id === parseInt(selectedRoom));

    if (fetching) return <PreLoader />;

    return (
        <div className="space-y-4">
            <h1 className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex flex-col sm:flex-row justify-center items-center text-2xl sm:text-4xl font-bold text-blue-600">
                Faculties
            </h1>
            <div className="bg-white shadow-light px-4 py-2 rounded-md w-1/2">
                <div className="text-2xl flex gap-2 items-center text-center">
                    Filter:
                    <select
                        onChange={handleRoomChange}
                        className="w-full p-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    >
                        <option value="all">All Faculties</option>
                        {faculties.map(faculty => {
                            const secondaryCount = faculty.schedules.reduce((count, schedule) => {
                                return count + (schedule.subject_secondary_schedule ? 1 : 0);
                            }, 0);

                            return (
                                <option key={faculty.id} value={faculty.id}>
                                    {formatFullNameFML(faculty)} ({faculty.schedules.length + secondaryCount} classes)
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            {filteredFaculties.map((faculty, index) => {
                const secondaryCount = faculty.schedules.reduce((count, schedule) => {
                    return count + (schedule.subject_secondary_schedule ? 1 : 0);
                }, 0);
                return (
                    <div
                        key={index}
                        className="w-full p-4 bg-white rounded-lg shadow-light space-y-4 border border-gray-200"
                    >
                        <h1
                            className="text-4xl tracking-wide border-b-2 border-gray-300 pb-2"
                        >
                            <span className="text-blue-700 font-bold"> {formatFullNameFML(faculty)}</span> <span className="text-gray-800 "> ({faculty.schedules.length + secondaryCount} classes)</span>

                        </h1>
                        <Schedule data={faculty.schedules} colorful={true}/>
                    </div>

                )
            })}
        </div>
    );
}

export default FacultySchedules;
