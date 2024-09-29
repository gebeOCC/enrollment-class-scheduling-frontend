import { useEffect, useState } from "react"
import axiosInstance from "../../../axios/axiosInstance";
import { capitalizeFirstLetter, getFirstLetter } from "../../utilities/utils";

function FacultyList() {
    const [searchBar, setSearchBar] = useState('')
    const [faculties, setFaculties] = useState([])
    useEffect(() => {
        axiosInstance.get(`get-faculty-list`)
            .then(response => {
                setFaculties(response.data)
            })
    }, [])
    
    const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
    const [isDefaultChecked, setIsDefaultChecked] = useState(true);
    const [form, setForm] = useState({
        user_id_no: '',
        password: '',
        user_role: 'faculty',
        first_name: '',
        last_name: '',
        middle_name: '',
        gender: '',
        birthday: '',
        contact_number: '',
        email_address: '',
        present_address: '',
        zip_code: '',
        department_id: '',
    })

    const handleFormChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleToUpperCase = (field) => {
        setForm((prev) => ({
            ...prev,
            [field]: prev[field].toUpperCase(),
        }));
    };

    useEffect(() => {
        if (form.first_name) {
            handleToUpperCase("first_name");
        }
        if (form.last_name) {
            handleToUpperCase("last_name");
        }
        if (form.middle_name) {
            handleToUpperCase("middle_name");
        }
        if (form.present_address) {
            handleToUpperCase("present_address");
        }
    }, [form.first_name, form.last_name, form.middle_name, form.present_address]);

    const handleGenderChange = (e) => {
        setForm(prev => ({
            ...prev,
            gender: e.target.value
        }));
    };

    const lastName = form.last_name.toLowerCase();
    const birthYear = form.birthday.split('-')[0];
    const defaultPassword = lastName + birthYear;

    const defaultPasswordChange = () => {
        if (isDefaultChecked) {
            setForm(prev => ({
                ...prev,
                password: defaultPassword
            }));
        }
    }

    useEffect(() => {
        defaultPasswordChange()
    }, [form.last_name, form.birthday, isDefaultChecked])

    const submitUserInfo = async (event) => {
        event.preventDefault();
        console.log(form)
        // setSubmitting(true);
        await axiosInstance.post(`add-faculty/`, form)
            .then(response => {
                if (response.data.message === "success") {
                    setForm({
                        user_id_no: '',
                        password: '',
                        user_role: 'faculty',
                        first_name: '',
                        last_name: '',
                        middle_name: '',
                        gender: '',
                        birthday: '',
                        contact_number: '',
                        email_address: '',
                        present_address: '',
                        zip_code: '',
                        department_id: '',
                    });
                    setIsFacultyModalOpen(false)
                    // setDepartmentsCourses(response.data.department);
                }
                console.log(response.data)
            }).finally(() => {
                // setSubmitting(false);
            })
    }

    const [departments, setdepartments] = useState([]);

    useEffect(() => {
        axiosInstance.get(`get-departments`)
            .then(response => {
                setdepartments(response.data)
            })
    }, [])

    const departmentsData = departments.map((department) => (
        <option key={department.id} value={department.id}>
            {department.department_name_abbreviation}
        </option>
    ));

    departmentsData.unshift(
        <option key="default" disabled value="">
            Select dept...
        </option>
    );

    return (
        <>
            <div className="p-6 bg-white shadow-md rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Faculty List</h2>
                    <div className="flex space-x-2">
                        <input
                            value={searchBar}
                            onChange={(e) => { setSearchBar(e.target.value) }}
                            type="text"
                            placeholder="Search faculty..."
                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <button
                            onClick={() => { setIsFacultyModalOpen(true) }}
                            className="bg-primaryColor text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            Add Faculty
                        </button>
                    </div>
                </div>

                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="w-full bg-[#00b6cf] text-white text-left">
                            <th className="py-2 px-4">#</th>
                            <th className="py-2 px-4">Faculty ID no.</th>
                            <th className="py-2 px-4">Name</th>
                            <th className="py-2 px-4">Email</th>
                            <th className="py-2 px-4">Department</th>
                            <th className="py-2 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faculties.length > 0 ? (
                            faculties.map((faculty) => (
                                (searchBar === "" || faculty.user_id_no.toLowerCase().includes(searchBar.toLowerCase()) || faculty.full_name.toLowerCase().includes(searchBar.toLowerCase())) &&
                                <tr
                                    key={faculty.id} // Use faculty.id as the unique key
                                    className={`border-b ${faculty.id % 2 === 0 ? "bg-[#deeced]" : "bg-white"}`}
                                >
                                    <td className="py-2 px-4">{faculty.id}</td>
                                    <td className="py-2 px-4">{faculty.user_id_no}</td>
                                    <td className="py-2 px-4">{capitalizeFirstLetter(faculty.last_name)}, {capitalizeFirstLetter(faculty.first_name)} {faculty.middle_name && getFirstLetter(capitalizeFirstLetter(faculty.middle_name)) + '.'}</td>
                                    <td className="py-2 px-4">{faculty.email_address}</td>
                                    <td className="py-2 px-4">{faculty.department_name_abbreviation}</td>
                                    <td className="py-2 px-4">Action</td>
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
            </div>

            {isFacultyModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md w-2/4">
                        <h2 className="text-3xl font-bold text-center mb-6">Add Faculty</h2>

                        <form>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">First Name</label>
                                    <input
                                        value={form.first_name}
                                        name="first_name"
                                        onChange={handleFormChange}
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Middle Name</label>
                                    <input
                                        value={form.middle_name}
                                        name="middle_name"
                                        onChange={handleFormChange}
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Last Name</label>
                                    <input
                                        value={form.last_name}
                                        name="last_name"
                                        onChange={handleFormChange}
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Gender</label>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="female"
                                                checked={form.gender === 'female'}
                                                onChange={handleGenderChange}
                                                className="form-radio" />
                                            <span className="ml-2">Female</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                checked={form.gender === 'male'}
                                                onChange={handleGenderChange}
                                                className="form-radio" />
                                            <span className="ml-2">Male</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Birthday</label>
                                    <input
                                        value={form.birthday}
                                        name="birthday"
                                        onChange={handleFormChange}
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Department</label>
                                    <select
                                        value={form.department_id}
                                        name="department_id"
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
                                        {departmentsData}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Address</label>
                                    <input
                                        value={form.present_address}
                                        name="present_address"
                                        onChange={handleFormChange}
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Zip code</label>
                                    <input
                                        value={form.zip_code}
                                        name="zip_code"
                                        onChange={handleFormChange}
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Contact no.</label>
                                <input
                                    value={form.contact_number}
                                    name="contact_number"
                                    onChange={handleFormChange}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    value={form.email_address}
                                    name="email_address"
                                    onChange={handleFormChange}
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Faculty ID no.</label>
                                <input
                                    value={form.user_id_no}
                                    name="user_id_no"
                                    onChange={handleFormChange}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <div className="flex items-center">
                                    <input
                                        value={form.password}
                                        name="password"
                                        onChange={handleFormChange}
                                        type="password"
                                        disabled={isDefaultChecked}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                    <label className="flex items-center ml-4">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox"
                                            checked={isDefaultChecked}
                                            onClick={() => { setIsDefaultChecked(!isDefaultChecked) }}
                                            onChange={defaultPasswordChange} />
                                        <span className="ml-2 text-sm">Default <span className="text-gray-500">lastname1998</span></span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                onClick={submitUserInfo}
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mb-2">
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsFacultyModalOpen(false)}
                                className="w-full border border-thirdColor text-thirdColor py-2 rounded-md hover:bg-thirdColor hover:text-white">
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </>
    )
}

export default FacultyList