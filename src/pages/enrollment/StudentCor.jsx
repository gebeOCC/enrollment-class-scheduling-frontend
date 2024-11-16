import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import PreLoader from "../../components/preloader/PreLoader";
import CorGenerator from "../Student/CorGenerator";

function StudentCor() {
    const { courseid, yearlevel, section } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [studentInfo, setStudentInfo] = useState([]);
    const studentId = searchParams.get('student-id');
    const [fetching, setFetching] = useState(true);
    const componentRef = useRef(null);

    useEffect(() => {
        const getStudentEnrollmentInfo = async () => {
            const yearLevelNumber =
                yearlevel === 'First-Year' ? '1' :
                    yearlevel === 'Second-Year' ? '2' :
                        yearlevel === 'Third-Year' ? '3' :
                            yearlevel === 'Fourth-Year' ? '4' : '';

            await axiosInstance.get(`get-student-enrollment-info/${courseid}/${yearLevelNumber}/${section}/${studentId}`)
                .then(response => {
                    if (response.data.message === 'success') {
                        setStudentInfo(response.data.studentinfo);
                    }
                })
                .finally(() => {
                    setFetching(false);
                });
        };

        getStudentEnrollmentInfo();
    }, [courseid, yearlevel, section]);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
    });

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'p' || event.key === 'P') {
                handlePrint();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handlePrint]);

    if (fetching) return <PreLoader />

    return (
        <div className="w-full flex flex-col justify-center items-center space-y-4">
            <div className="space-y-2">
                <div className="flex text-center space-x-2">
                    <div className="flex text-center space-x-2 p-2 bg-white  rounded-md w-max">
                        <button
                            onClick={handlePrint}
                            className="bg-gray-800 shadow-heavy text-white py-2 px-4 rounded w-30 text-lg transition transform active:scale-95"
                        >
                            Print
                        </button>
                        <p className="content-center text-gray-500 text-sm">or Press "P" on your keyboard to print</p>
                    </div>
                </div>
                <div className="shadow-heavy rounded-2xl">
                    <div ref={componentRef}>
                        <CorGenerator data={studentInfo} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentCor;
