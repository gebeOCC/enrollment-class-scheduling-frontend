// turns date format to long date
export const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
};

// convert 24 hours to am pm
export function convertToAMPM(time) {
    if (!time || typeof time !== 'string' || !time.includes(':')) {
        return ''; // or return a default value like 'N/A'
    }

    const [hour, minute] = time.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const convertedHour = hour % 12 || 12;

    return `${convertedHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
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

// Capitalize the first letter of each word in a string (use for displaying names)
export function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
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

// Convert "YYYY-MM-DD" to "MMM DD, YYYY" format (e.g., "2024-12-30" to "Dec 30, 2024")
export function formatDateShort(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
}

// format full name into this format "Lastname, Firstname M."
export function formatFullName(userInfo) {
    const { last_name, first_name, middle_name } = userInfo;
    return `${capitalizeFirstLetter(last_name)}, ${capitalizeFirstLetter(first_name)}${middle_name ? ' ' + getFirstLetter(capitalizeFirstLetter(middle_name)) + '.' : ''}`;
};

// format full name into this format "Lastname, Firstname M."
export function formatFullNameFML(userInfo) {
    const { last_name, first_name, middle_name } = userInfo;
    return `${capitalizeFirstLetter(first_name)} ${middle_name ? ' ' + getFirstLetter(capitalizeFirstLetter(middle_name)) + '.' : ''} ${capitalizeFirstLetter(last_name)}`;
};

// format date into valid yyyy/mm/dd
export function formatBirthday(birthday) {
    if (!birthday) return '';

    let date;

    if (/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
        date = new Date(birthday);
    } else {
        date = new Date(birthday);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// check password complexity
export function checkPasswordComplexity(password) {
    const requirements = {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    };

    if (password.length >= 8) requirements.length = true; // Minimum length of 8
    if (/[A-Z]/.test(password)) requirements.uppercase = true; // At least one uppercase letter
    if (/[a-z]/.test(password)) requirements.lowercase = true; // At least one lowercase letter
    if (/\d/.test(password)) requirements.number = true; // At least one number
    if (/[^A-Za-z0-9]/.test(password)) requirements.special = true; // At least one special character

    const isValid = Object.values(requirements).every(Boolean); // Check if all requirements are met

    return {
        isValid,
        requirements: {
            length: requirements.length,
            uppercase: requirements.uppercase,
            lowercase: requirements.lowercase,
            number: requirements.number,
            special: requirements.special,
        },
    };
}