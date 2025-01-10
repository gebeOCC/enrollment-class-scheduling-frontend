import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import CorGenerator from "./CorGenerator";
import PreLoader from "../../components/preloader/PreLoader";

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
                })
                .finally(() => {
                    setFetching(false);
                })
        }

        getEnrollmentRecord();
    }, [])

    if (fetching) return <PreLoader />

    return (
        <div className="w-full flex flex-col justify-center items-center space-y-4">
            <div className="bg-white p-2 sm:p-4 rounded-lg shadow-light overflow-hidden text-center flex justify-center items-center w-full">
                <h1 className="text-lg sm:text-4xl font-bold text-blue-600 flex sm:gap-2">
                    Enrollment Record
                </h1>
            </div>
            {data ?
                (
                    <div className="w-80 h-[60vh] md:h-auto md:w-min bg-grid-pattern rounded-lg overflow-x-auto bg-white shadow-inner p-4 flex">
                        {classes.map((classes, index) => (
                            <div key={index} className='w-max bg-white rounded-lg shadow-lg h-max'>
                                <div id="COR">
                                    <CorGenerator data={classes} />
                                </div>
                            </div>
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