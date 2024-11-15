import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import html2canvas from "html2canvas";
import CorGenerator from "./CorGenerator";
import ScheduleGenerator from "./ScheduleGenerator";
import PreLoader from "../../components/preloader/PreLoader";
import { FaDownload } from "react-icons/fa";
import { formatFullName, formatFullNameFML } from "../../utilities/utils";
import html2pdf from 'html2pdf.js';

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
                setEnrolled(true);
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

    const captureComponent = () => {
        const element = document.getElementById(selected);
        if (element) {
            // Apply styling to ensure images are inline
            const style = document.createElement('style');
            document.head.appendChild(style);
            style.sheet?.insertRule('body > div:last-child img { display: inline-block; }');

            if (selected === 'COR') {
                // If the selected component is COR, download as PDF
                const options = {
                    filename: `${formatFullName(classes.user.user_information)} ${schoolYear?.start_year || 'Unknown'}-${schoolYear?.end_year || 'Unknown'} ${schoolYear?.semester_name || 'Unknown'} Semester.pdf`,
                    html2canvas: { scale: 5 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                };

                html2pdf()
                    .from(element)
                    .set(options)
                    .save()
                    .finally(() => style.remove());  // Ensure style is removed after PDF export
            } else {
                // Fallback to image download logic
                html2canvas(element, { scale: 5 }).then((canvas) => {
                    const imageUrl = canvas.toDataURL("image/png");
                    const filename = `${formatFullName(classes.user.user_information)} ${schoolYear?.start_year || 'Unknown'}-${schoolYear?.end_year || 'Unknown'} ${schoolYear?.semester_name || 'Unknown'} Semester.png`;

                    const link = document.createElement("a");
                    link.href = imageUrl;
                    link.download = filename;
                    link.click();

                    style.remove(); // Remove style after image export
                });
            }
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

    if (fetching) return <PreLoader />

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
                <div className="bg-white p-2 sm:p-4 rounded-lg shadow-light overflow-hidden text-center flex justify-center items-center w-full">
                    <h1 className="text-lg sm:text-4xl font-bold text-blue-600 flex sm:gap-2">
                        {schoolYear?.start_year}-{schoolYear?.end_year} {schoolYear?.semester_name} Semester
                    </h1>
                </div>

                <div className="flex items-center space-x-1 p-1 bg-gray-300 w-full sm:w-96 rounded-lg text-black">
                    {/* Button for COR */}
                    <button
                        onClick={() => setSelected('COR')}
                        className={`w-1/2 px-4 py-2 rounded-lg ${selected === 'COR' ? 'bg-white text-blue-500' : ''
                            } transition-colors duration-300 `}
                    >
                        COR
                    </button>

                    {/* Button for Schedule */}
                    <button
                        onClick={() => setSelected('Schedule')}
                        className={`w-1/2 px-4 py-2 rounded-lg ${selected === 'Schedule' ? 'bg-white text-blue-500' : ''
                            } transition-colors duration-300 `}
                    >
                        Schedule
                    </button>
                </div>
                {enrolled ?
                    (
                        <div className="relative">
                            <button
                                onClick={captureComponent}
                                className="flex gap-2 items-center cursor-pointer duration-100 text-blue-500 w-max h-10 py-2 px-4 shadow-gray-400 shadow-md absolute top-0 right-0 bg-white rounded-tr-lg active:transform active:translate-x-[-4px] active:translate-y-[4px]">
                                Download
                                <FaDownload size={30} />
                            </button>

                            <div className="w-80 md:w-min rounded-lg overflow-x-auto bg-white shadow-inner p-4 flex">
                                {selected == 'COR' ? (
                                    <div className='w-max bg-white rounded-lg shadow-lg'>
                                        <div id="COR">
                                            <CorGenerator data={classes} />
                                        </div>
                                    </div>
                                ) : (
                                    <div id="Schedule">
                                        <ScheduleGenerator data={classes} />
                                    </div>
                                )}
                            </div>
                        </div>

                    ) : (
                        <div className='bg-white p-4 rounded-lg shadow-light overflow-hidden'>
                            <h1 className="text-2xl font-bold"> No data</h1>
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default StudentClasses;
