import { useState, useEffect } from "react"
import axiosInstance from "../../../axios/axiosInstance"
import { capitalizeFirstLetter, formatBirthday, formatPhoneNumber, getFirstLetter, isValidEmail, removeHyphens } from "../../utilities/utils";
import * as XLSX from 'xlsx';
import { NavLink, useNavigate } from "react-router-dom";
import AddNewStudentModal from "../GlobalFunction/AddNewStudentModal";
import { CiImport } from "react-icons/ci";
import PreLoader from "../../components/preloader/PreLoader";

function Studentlist() {
    const navigate = useNavigate();
    const [searchBar, setSearchBar] = useState('')
    const [students, setStudents] = useState([])
    const [showCount, setShowCount] = useState(10);
    const [message, setMessage] = useState('');
    const [data, setData] = useState([]);

    const [uploadingStudents, setUploadingStudents] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [totalUpload, setTotalUpload] = useState(0);
    const [totalStudentsInExcel, setTotalStudentsInExcel] = useState(0);
    const progressPercentage = ((totalUpload / totalStudentsInExcel) * 100).toFixed(2);

    const getStudentList = async () => {
        axiosInstance.get(`get-student-list`)
            .then(response => {
                setStudents(response.data)
            })
            .finally(() => {
                setFetching(false);
            })
    }

    useEffect(() => {
        getStudentList();
    }, [])

    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)

    const [uploadExcelStudentList, setUploadExcelStudentList] = useState([]);

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            readExcel(uploadedFile);
        }
    };

    const readExcel = (file) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const headers = jsonData[0].slice(1);
            const zipCodeIndex = headers.indexOf("ZIP CODE");

            const totalStudents = jsonData.slice(1).length;

            setTotalStudentsInExcel(totalStudents);
            setUploadingStudents(true);

            let totalStudentUpload = 0;

            const uploadPromises = jsonData.slice(1).map(row => {
                const student = {};
                headers.forEach((header, index) => {
                    if (index <= zipCodeIndex) {
                        const cellValue = row[index + 1];
                        if (header === "BIRTH DATE (mm/dd/yy)" && typeof cellValue === 'number') {
                            const excelDate = new Date(Math.floor((cellValue - 25569) * 86400 * 1000));
                            student[header] = excelDate.toLocaleDateString("en-US");
                        } else {
                            student[header] = cellValue;
                        }
                    }
                });

                return axiosInstance.post(`import-students/`, {
                    user_id_no: student['STUDENT ID NO'] || '',
                    first_name: student['FIRST NAME'] || '',
                    last_name: student['LAST NAME'] || '',
                    middle_name: student['MIDDLE NAME'] || '',
                    gender: student['GENDER'] || '',
                    birthday: formatBirthday(student['BIRTH DATE (mm/dd/yy)']) || '',
                    contact_number: student['Contact No.'] || '',
                    email_address: student['Email Address'] || '',
                    present_address: student['Present Address'] || '',
                    zip_code: student['ZIP CODE'] || '',
                })
                    .then(response => {
                        if (response.data.message === "success") {
                            setUploadExcelStudentList(prevList =>
                                prevList.map(existingStudent =>
                                    existingStudent.id_number === newStudent.id_number
                                        ? { ...existingStudent, uploading_status: true }
                                        : existingStudent
                                )
                            );
                            const newStudent = {
                                id_number: student['STUDENT ID NO'],
                                first_name: student['FIRST NAME'],
                                last_name: student['LAST NAME'],
                                uploading_status: false,
                            };

                            setUploadExcelStudentList(prevList => [...prevList, newStudent]);
                            console.log(response.data.message);
                        } else {
                            console.log(response.data);
                        }
                    })
                    .catch(error => {
                        console.error("Error uploading student:", error);
                    })
                    .finally(() => {
                        setTotalUpload(prevNum => prevNum + 1);
                        totalStudentUpload++;
                        if (totalStudentUpload == totalStudents) {
                            getStudentList();
                        }
                        // console.log(totalStudentUpload);
                        // console.log(totalStudents);
                    })
            });

            await Promise.all(uploadPromises);
        };

        reader.readAsArrayBuffer(file);
    };

    if (fetching) return <PreLoader />

    return (
        <>
            <div className="p-6 bg-white shadow-md rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold mb-2 sm:mb-0">Student List</h2>
                    <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-2 w-full sm:w-auto">
                        <select
                            value={showCount}
                            onChange={(e) => setShowCount(parseInt(e.target.value))}
                            className="border px-2 rounded-md h-10 text-center bg-white outline-none cursor-pointer w-full mb-2 md:mb-0 md:w-20"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <input
                            value={searchBar}
                            onChange={(e) => { setSearchBar(e.target.value) }}
                            type="text"
                            placeholder="Search faculty..."
                            className="px-4 py-2 rounded-md mb-2 md:mb-0 border focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                        />
                        <label className="hidden md:block justify-center items-center border border-green-500 text-green-500 px-6 py-2 rounded-md hover:bg-green-500 hover:text-white transition duration-300 cursor-pointer">
                            Import Excel
                            <input
                                type="file"
                                accept=".xls,.xlsx"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                </div>

                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="w-full bg-[#00b6cf] text-white text-left">
                            <th className="py-2 px-2 md:px-4">ID Number</th>
                            <th className="py-2 px-2 md:px-4">Name</th>
                            <th className="py-2 px-2 md:px-4 hidden sm:table-cell">Email</th>
                            <th className="py-2 px-2 md:px-4 hidden sm:table-cell">Contact no.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students
                                .filter((student) => (
                                    searchBar === "" ||
                                    student.user_id_no.toLowerCase().includes(searchBar.toLowerCase()) ||
                                    (String(student.last_name) + String(student.first_name) + getFirstLetter(String(student.middle_name)))
                                        .toLowerCase().includes(searchBar.toLowerCase())
                                ))
                                .slice(0, showCount)
                                .map((student, index) => (
                                    <tr
                                        key={index}
                                        className={`border-b hover:bg-[#deeced] cursor-pointer`}
                                        onClick={() => navigate(`student-details?student-id=${student.user_id_no}`)}
                                    >
                                        <td className="py-2 px-2 transition duration-200 hover:py-3 md:px-4">{student.user_id_no}</td>
                                        <td className="py-2 px-2 transition duration-200 hover:py-3 md:px-4">
                                            {capitalizeFirstLetter(student.last_name)}, {capitalizeFirstLetter(student.first_name)}{" "}
                                            {student.middle_name && getFirstLetter(student.middle_name) + '.'}
                                        </td>
                                        <td className="py-2 px-2 transition duration-200 hover:py-3 md:px-4 hidden sm:table-cell">{student.email_address}</td>
                                        <td className="py-2 px-2 transition duration-200 hover:py-3 md:px-4 hidden sm:table-cell">{student.contact_number}</td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td className="py-2 px-4" colSpan="6">
                                    No Data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div >

            {
                uploadExcelStudentList.map((student, index) => (
                    <div key={index}>
                        {student.id_no}
                    </div>
                ))
            }

            {
                uploadingStudents && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col justify-between">
                            {/* Modal Header */}
                            <h1 className="text-3xl font-semibold text-center mb-4">
                                Uploading Students
                            </h1>

                            {/* Warning Message */}
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-4">
                                <p className="text-center font-medium">
                                    Please do not close or refresh the browser while students are being uploaded.
                                </p>
                            </div>

                            {/* Progress Percentage */}
                            <div className="flex flex-col items-center">
                                <span className="text-lg font-medium mb-2">
                                    {progressPercentage}% Complete
                                </span>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                                    <div
                                        className="bg-blue-600 h-4 rounded-full transition-all"
                                        style={{ width: `${progressPercentage}%` }}>
                                    </div>
                                </div>

                                {/* Progress Details */}
                                <p className="text-gray-600">
                                    {totalUpload} out of {totalStudentsInExcel} students uploaded
                                </p>
                            </div>

                            {/* Footer - Close Button */}
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setUploadingStudents(false)}
                                    disabled={progressPercentage !== "100.00"}
                                    className={`px-4 py-2 rounded-md shadow-md transition ${progressPercentage === "100.00"
                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <AddNewStudentModal open={isStudentModalOpen} setOpen={setIsStudentModalOpen} setMessage={setMessage} setData={setData} />
        </>
    )
}

export default Studentlist