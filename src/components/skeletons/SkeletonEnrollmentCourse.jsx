function SkeletonEnrollmentCourse() {
    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow overflow-hidden mb-6 text-center animate-pulse">
                <h1 className="text-4xl font-bold text-transparent h-10">
                   
                </h1>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-light hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                        <div className="mb-4 flex justify-between items-center">
                            <h2 className="text-2xl font-semibold text-gray-800">{index == 0 && "First Year"}{index == 1 && "Second Year"}{index == 2 && "Third Year"}{index == 3 && "Fourth Year"}</h2>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-transform transform">
                                Add Section
                            </button>
                        </div>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-blue-700 text-white text-left">
                                    <th className="p-2">Section</th>
                                    <th className="p-2">Students</th>
                                    <th className="p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array(3).fill(0).map((_, index) => (
                                    <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"}`}>
                                        <td className="p-2">
                                            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                                        </td>
                                        <td className="p-2">
                                            <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                                        </td>
                                        <td className="p-2 space-x-2 flex items-center">
                                            <div className="h-8 w-20 bg-indigo-300 rounded animate-pulse"></div>
                                            <div className="h-8 w-20 bg-green-300 rounded animate-pulse"></div>
                                            <div className="h-8 w-24 bg-purple-300 rounded animate-pulse"></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                ))}
            </div>

        </>)
}

export default SkeletonEnrollmentCourse;