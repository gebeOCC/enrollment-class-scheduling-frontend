import { useEffect, useState } from "react"
import PreLoader from "../../components/preloader/PreLoader";
import axiosInstance from "../../../axios/axiosInstance";
import Schedule from "../Schedule/Schedule";
import { FaDownload } from "react-icons/fa";
import { formatFullName } from "../../utilities/utils";
import html2canvas from "html2canvas";

function EnrollmentSubjectsSchedules() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [fetching, setFetching] = useState(true);
    const [colorful, setColorful] = useState(true);
    const [plotting, setPlotting] = useState(true);

    const getEnrollmentSubjectsSchedule = async () => {
        await axiosInstance.get(`get-enrollment-subjects-schedule`)
            .then(response => {
                setSubjects(response.data);
            })
            .finally(() => {
                setFetching(false);
            })
    }

    useEffect(() => {
        getEnrollmentSubjectsSchedule()
    }, [])

    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
    };

    const filteredSubjects =
        selectedSubject === "all"
            ? subjects
            : subjects.filter(subject => subject.id === parseInt(selectedSubject));

    const exportToExcel = () => {
        console.log('nag export ko')
    }

    const downloadAllSchedules = () => {
        console.log('nag download')
        subjects.forEach((subject, index) => {
            const element = document.getElementById(`schedule-${index}`);
            if (element) {
                // Add inline styling for images
                const style = document.createElement("style");
                document.head.appendChild(style);
                style.sheet?.insertRule('body > div:last-child img { display: inline-block; }');

                html2canvas(element, { scale: 5 }).then((canvas) => {
                    const imageUrl = canvas.toDataURL("image/png");
                    const filename = `${subject.descriptive_title} ${subject.schedules.length + secondaryCount} classes).png`;

                    const link = document.createElement("a");
                    link.href = imageUrl;
                    link.download = filename;
                    link.click();

                    style.remove(); // Remove style after image export
                });
            }
        });
    };

    if (fetching) return <PreLoader />

    return (
        <div className="space-y-4">
            <h1 className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex flex-col sm:flex-row justify-center items-center text-2xl sm:text-4xl font-bold text-blue-600">
                Subjects
            </h1>
            <div className="flex gap-4">
                <div className='flex shadow-sm rounded-md'>
                    {/* View Mode Selection */}
                    <button
                        onClick={() => setPlotting(false)}
                        className={`border-y border-l w-28 p-2 rounded-l-md ${!plotting
                            ? 'bg-white text-blue-700 underline'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-300'
                            }`}
                    >
                        Tabular
                    </button>
                    <button
                        onClick={() => setPlotting(true)}
                        className={`border-y border-r w-28 p-2 rounded-r-md ${plotting
                            ? 'bg-white text-blue-700 underline'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-300'
                            }`}
                    >
                        Timetable
                    </button>
                </div>
                <select
                    onChange={handleSubjectChange}
                    className="min-h-max shadow-sm max-w-max flex-1 p-2 hover:border-blue-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                >
                    <option value="all">All Subjects</option>
                    {subjects.map(subject => {
                        const secondaryCount = subject.schedules.reduce((count, schedule) => {
                            return count + (schedule.subject_secondary_schedule ? 1 : 0);
                        }, 0);

                        return (
                            <option key={subject.id} value={subject.id}>
                                {formatFullName(subject)} ({subject.schedules.length + secondaryCount} classes)
                            </option>
                        );
                    })}
                </select>
                <button
                    onClick={exportToExcel}
                    className="h-min flex gap-2 shadow-lg bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 transition-all duration-200"
                >
                    <FaDownload className="text-xl" />
                    Excel
                </button>
                <button
                    onClick={downloadAllSchedules}
                    className="h-min flex gap-2 shadow-lg bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-200"
                >
                    <FaDownload className="text-xl" />
                    Image
                </button>

                <button className={`self-center mb-1 bg-white border border-gray-300 flex items-center gap-1 rounded-md transition-all duration-200 w-max h-min `}>
                    <input
                        id="colorful"
                        type="checkbox"
                        checked={colorful}
                        onChange={(e) => {
                            setColorful(e.target.checked);
                        }}
                        className={`
                                                ml-2
                                                cursor-pointer 
                                                h-4 w-4 
                                                appearance-none
                                                border border-gray-500 rounded-md 
                                                checked:bg-white checked:border-blue-500
                                                checked:after:content-['✔']
                                                checked:after:text-blue-500 
                                                checked:after:font-bold
                                                flex items-center justify-center
                                                `}
                    />

                    <label
                        htmlFor="colorful"
                        className={`cursor-pointer text-black font-medium py-1 pr-2`}
                    >
                        Color
                    </label>
                </button>
            </div>

            {filteredSubjects.map((subject, index) => {
                const secondaryCount = subject.schedules.reduce((count, schedule) => {
                    return count + (schedule.subject_secondary_schedule ? 1 : 0);
                }, 0);
                return (
                    <div
                        id={`schedule-${index}`}
                        className="w-full p-4 bg-white rounded-lg shadow-light space-y-4 border border-gray-200"
                    >
                        <h1
                            className="text-3xl tracking-wide border-b-2 border-gray-300 pb-2"
                        >
                            <span className="text-blue-700 font-bold">{subject.descriptive_title}</span> <span className="text-gray-800 ">({subject.schedules.length + secondaryCount} classes)</span>
                        </h1>
                        <Schedule data={subject.schedules} colorful={true} />
                    </div>
                )
            })}
        </div>
    )
}

export default EnrollmentSubjectsSchedules