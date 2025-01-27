import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import Schedule from "../Schedule/Schedule";
import PreLoader from "../../components/preloader/PreLoader";
import { formatFullName } from "../../utilities/utils";
import html2canvas from "html2canvas";

function FacultySchedules() {
    const [faculties, setFaculties] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("all"); // Default to "all"
    const [fetching, setFetching] = useState(true);
    const [colorful, setColorful] = useState(true);

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


    const downloadAllSchedules = () => {
        filteredFaculties.forEach((faculty, index) => {
            const element = document.getElementById(`schedule-${index}`);
            if (element) {
                // Add inline styling for images
                const style = document.createElement("style");
                document.head.appendChild(style);
                style.sheet?.insertRule('body > div:last-child img { display: inline-block; }');

                html2canvas(element, { scale: 5 }).then((canvas) => {
                    const imageUrl = canvas.toDataURL("image/png");
                    const filename = `${formatFullName(faculty)} (${faculty.schedules.length} classes).png`;

                    const link = document.createElement("a");
                    link.href = imageUrl;
                    link.download = filename;
                    link.click();

                    style.remove(); // Remove style after image export
                });
            }
        });
    };

    if (fetching) return <PreLoader />;

    return (
        <div className="space-y-4">
            <h1 className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex flex-col sm:flex-row justify-center items-center text-2xl sm:text-4xl font-bold text-blue-600">
                Faculties
            </h1>
            <div className="flex items-center gap-6 bg-white p-4 rounded-lg shadow-md w-max">
                <label className="text-xl font-semibold text-gray-700">Filter:</label>
                <select
                    onChange={handleRoomChange}
                    className="flex-1 p-2 border hover:border-blue-500 border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                >
                    <option value="all">All Faculties</option>
                    {faculties.map(faculty => {
                        const secondaryCount = faculty.schedules.reduce((count, schedule) => {
                            return count + (schedule.subject_secondary_schedule ? 1 : 0);
                        }, 0);

                        return (
                            <option key={faculty.id} value={faculty.id}>
                                {formatFullName(faculty)} ({faculty.schedules.length + secondaryCount} classes)
                            </option>
                        );
                    })}
                </select>

                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-md border border-gray-300 hover:shadow-lg transition-all duration-200">
                    <label
                        htmlFor="time-table"
                        className="cursor-pointer text-gray-700 font-medium"
                    >
                        Colorful
                    </label>
                    <input
                        id="time-table"
                        type="checkbox"
                        checked={colorful}
                        onChange={(e) => setColorful(e.target.checked)}
                        className="cursor-pointer h-5 w-5 accent-blue-500"
                    />
                </div>
                <button
                    onClick={downloadAllSchedules}
                    className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-lg hover:bg-blue-700 transition-all duration-200"
                >
                    Download All
                </button>
            </div>

            {filteredFaculties.map((faculty, index) => {
                const secondaryCount = faculty.schedules.reduce((count, schedule) => {
                    return count + (schedule.subject_secondary_schedule ? 1 : 0);
                }, 0);
                return (
                    <div
                        id={`schedule-${index}`}
                        key={index}
                        className="w-full p-4 bg-white rounded-lg shadow-light space-y-4 border border-gray-200"
                    >
                        <h1
                            className="text-4xl tracking-wide border-b-2 border-gray-300 pb-2"
                        >
                            <span className="text-blue-700 font-bold"> {formatFullName(faculty)}</span> <span className="text-gray-800 "> ({faculty.schedules.length + secondaryCount} classes)</span>

                        </h1>
                        <Schedule data={faculty.schedules} colorful={colorful} />
                    </div>

                )
            })}
        </div>
    );
}

export default FacultySchedules;
