import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { PiSpinnerBold } from "react-icons/pi";
import CorGenerator from "./CorGenerator";
import ScheduleGenerator from "./ScheduleGenerator";

function EnrollmentRecord() {
    const [classes, setClasses] = useState([]);
    const [data, setData] = useState(true);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const getEnrollmentRecord = async () => {
            await axiosInstance.get(`get-enrollment-record`)
                .then(response => {
                    if (response.data.message == 'success') {
                        setClasses(response.data.studentClasses);
                    } else if (response.data.message == 'no data') {
                        setData(false);
                    }
                    console.log(response.data)
                })
                .finally(() => {
                    setFetching(false);
                })
        }

        getEnrollmentRecord();
    }, [])

    const [selected, setSelected] = useState('COR');

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-full text-blue-600">
                <PiSpinnerBold className="animate-spin text-4xl" size={45} />
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col justify-center items-center space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-light overflow-hidden text-center flex justify-center items-center w-full">
                <h1 className="text-4xl font-bold text-blue-600">
                    Enrollment Record
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
            {data ?
                (
                    <div className="w-96 md:w-min rounded-lg overflow-x-scroll">
                        {classes.map((classes, index) => (
                            <>
                                {selected == 'COR' ? (
                                    <div className='w-max bg-white rounded-lg'>
                                        <div id="COR" className="p-6">
                                            <CorGenerator data={classes} />
                                        </div>
                                    </div>
                                ) : (
                                    <ScheduleGenerator data={classes} />
                                )
                                }
                            </>
                        ))
                        }
                    </div>
                ) : (
                    <div className='bg-white p-4 rounded-lg shadow-light overflow-hidden'>
                        <h1 className="text-2xl font-bold"> No data</h1>
                    </div>
                )
            }
        </div >
    )
}

export default EnrollmentRecord;