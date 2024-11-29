function SkeletonStudentsAttendanceList() {
    return(
        <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-light">
            <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                        Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                        Status
                    </th>
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: 40 }).map((_, index) => (
                    <tr key={index} className="bg-white h-12">
                        {/* Name Column Skeleton */}
                        <td className="px-4 py-2 text-gray-800 border border-gray-300">
                            <div className="h-4 bg-gray-300 rounded w-60"></div>
                        </td>

                        {/* Status Column Skeleton */}
                        <td className="px-4 py-2 text-gray-800 border border-gray-300 w-36">
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default SkeletonStudentsAttendanceList