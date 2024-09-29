// nalimot ko asa ni ge naapil ra ni og copy sa daan na codes
export const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
};

// convert 24 hours to am pm
export function convertToAMPM(time) {
    const date = new Date(`2000-01-01T${time}`);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return formattedTime;
}

// convert minutes to 24 hours
export function convertMinutesTo24HourTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(remainingMinutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
}

// convert 24 hours to minutes
export function convert24HourTimeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes;
}

// convert am pm to 24 hours
export function convertAMPMTo24Hour(time) {
    let [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
        hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
        hours = 0;
    }

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}

// collect two schedules with start and end time (formatted in minutes), returns true if has conflict otherwise false 
export function hasTimeConflict(start1, end1, start2, end2) {
    return !(end1 <= start2 || end2 <= start1);
}

// Capitalize the first letter (use for displaying names)
export function capitalizeFirstLetter(word) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// return the first letter (use for middle names)
export function getFirstLetter(word) {
    if (!word) return '';
    return word.charAt(0);
}

// this adds hyphens to phone number if the length is 11 (ex. 0934-567-8901)
export function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.length !== 11) {
        return removeHyphens(cleaned);
    }

    const formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    return formatted;
}

// this remove the hyphens (use for removing the hyphens of the phone number)
export function removeHyphens(text) {
    return text.replace(/-/g, '');
}

// this return true if the email is valid otherwise false
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}