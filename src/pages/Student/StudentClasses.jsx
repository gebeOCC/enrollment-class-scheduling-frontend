import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { PiSpinnerBold } from "react-icons/pi";
import html2canvas from "html2canvas";
import CorGenerator from "./CorGenerator";
import ScheduleGenerator from "./ScheduleGenerator";

function StudentClasses() {
    const [classes, setClasses] = useState([]);
    const [schoolYear, setSchoolYear] = useState(null);
    const [enrolled, setEnrolled] = useState(false);
    const [fetching, setFetching] = useState(true);
    const componentRef = useRef(null);

    const [selected, setSelected] = useState('COR');

    const getStudentClasses = async () => {
        try {
            const response = await axiosInstance.get(`get-student-classes`);
            if (response.data.message === 'success') {
                setClasses(response.data.studentClasses);
                setSchoolYear(response.data.schoolYear);
            } else if (response.data.message === 'not enrolled') {
                setSchoolYear(response.data.schoolYear);
                setEnrolled(false);
            }
        } catch (error) {
            console.error('Error fetching student classes:', error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        getStudentClasses();
    }, []);

    const captureAsImage = () => {
        const element = document.getElementById(selected);
        if (element) {
            const style = document.createElement('style');
            document.head.appendChild(style);
            style.sheet?.insertRule('body > div:last-child img { display: inline-block; }');

            html2canvas(element, { scale: 5 }).then((canvas) => {
                const imageUrl = canvas.toDataURL("image/png");
                const filename = `${schoolYear?.start_year || 'Unknown'}-${schoolYear?.end_year || 'Unknown'} ${schoolYear?.semester_name || 'Unknown'} Semester.png`;

                const link = document.createElement("a");
                link.href = imageUrl;
                link.download = filename;
                link.click();

                style.remove();
            });
        }
    };
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0 });
    const [position, setPosition] = useState({ x: 0 });

    const handleMouseDown = (e) => {
        setDragging(true);
        setOffset({ x: e.clientX - position.x });
    };

    // Handle dragging
    const handleMouseMove = (e) => {
        if (!dragging) return;
        setPosition({ x: e.clientX - offset.x });
    };

    // Stop dragging
    const handleMouseUp = () => {
        setDragging(false);
    };

    // Apply the drag styles
    const draggableStyle = {
        position: 'relative',
        left: position.x,
        cursor: dragging ? 'grabbing' : 'grab',
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-full text-blue-600">
                <PiSpinnerBold className="animate-spin text-4xl" size={45} />
            </div>
        );
    }

    if (!enrolled && !schoolYear) {
        return (
            <div className="text-center text-red-600">
                <h2>You are not enrolled in any classes for the current semester.</h2>
            </div>
        );
    }

    return (
        <>
            <div className="w-full flex flex-col justify-center items-center space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex justify-center items-center w-full">
                    <h1 className="text-4xl font-bold text-blue-600">
                        {schoolYear?.start_year}-{schoolYear?.end_year} {schoolYear?.semester_name} Semester
                    </h1>
                </div>

                <div className="flex items-center space-x-1 p-1 bg-gray-300 w-max rounded-lg text-black">
                    {/* Button for COR */}
                    <button
                        onClick={() => setSelected('COR')}
                        className={`w-36 px-4 py-2 rounded-lg ${selected === 'COR' ? 'bg-white text-blue-500' : ''
                            } transition-colors duration-300 `}
                    >
                        COR
                    </button>

                    {/* Button for Schedule */}
                    <button
                        onClick={() => setSelected('Schedule')}
                        className={`w-36 px-4 py-2 rounded-lg ${selected === 'Schedule' ? 'bg-white text-blue-500' : ''
                            } transition-colors duration-300 `}
                    >
                        Schedule
                    </button>
                </div>
                <div className="w-96 md:w-min rounded-lg overflow-x-scroll">
                    {selected == 'COR' ? (
                        <div className='w-max bg-white rounded-lg'>
                            <div id="COR" ref={componentRef} className="p-6">
                                <CorGenerator data={classes} />
                            </div>
                        </div>
                    ) : (
                        <ScheduleGenerator data={classes} />
                    )
                    }
                </div>
                <button
                    onClick={captureAsImage}
                    className="bg-transparent border-2 border-blue-600 text-blue-600 px-3 py-2 rounded-lg w-full sm:w-auto 
             hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
             active:bg-blue-700 active:border-blue-700 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                >
                    Download as Image
                </button>

            </div>
        </>
    );
}

export default StudentClasses;
