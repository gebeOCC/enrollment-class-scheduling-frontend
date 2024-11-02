import { PiSpinnerBold } from "react-icons/pi";

function Loading() {
    return (
        <div className="flex justify-center items-center h-full bg-opacity-50 bg-gray-100">
            <PiSpinnerBold className="animate-spin text-blue-600 text-5xl" size={45} />
            <span className="ml-3 text-blue-600">Loading...</span>
        </div>
    )
}
export default Loading;