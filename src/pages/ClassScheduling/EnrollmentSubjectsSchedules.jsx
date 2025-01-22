import { useEffect, useState } from "react"
import PreLoader from "../../components/preloader/PreLoader";
import axiosInstance from "../../../axios/axiosInstance";
import Schedule from "../Schedule/Schedule";

function EnrollmentSubjectsSchedules() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [fetching, setFetching] = useState(true);
    const [search, setSearch] = useState('');

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


    if (fetching) return <PreLoader />

    return (
        <div className="space-y-4">
            <h1 className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex flex-col sm:flex-row justify-center items-center text-2xl sm:text-4xl font-bold text-blue-600">
                Subjects
            </h1>
            <div className="flex items-center gap-6 bg-white p-4 rounded-lg shadow-md w-max">
                <label className="text-xl font-semibold text-gray-700">Filter:</label>
                {/* <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value) }}
                        type="text"
                        className="w-full h-12 p-2 border border-gray-300 rounded-md focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out" /> */}
                <select
                    onChange={handleSubjectChange}
                    className="flex-1 p-2 hover:border-blue-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                >
                    <option value="all">All Subjects</option>
                    {subjects.map(subject => {
                        const secondaryCount = subject.schedules.reduce((count, schedule) => {
                            return count + (schedule.subject_secondary_schedule ? 1 : 0);
                        }, 0);

                        return (
                            <option key={subject.id} value={subject.id}>
                                {subject.descriptive_title} ({subject.schedules.length + secondaryCount} classes)
                            </option>
                        );
                    })}
                </select>
            </div>

            {filteredSubjects.map((subject, index) => {
                const secondaryCount = subject.schedules.reduce((count, schedule) => {
                    return count + (schedule.subject_secondary_schedule ? 1 : 0);
                }, 0);
                return (
                    <div
                        key={index}
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