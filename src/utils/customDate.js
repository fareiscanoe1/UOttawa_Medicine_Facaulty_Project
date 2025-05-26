// Create an object containing the date formatting options
const setting = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second:'numeric', hour12: true };

// Function to format a date string using the specified formatting options
export function dateFormat(dateInput) {
    /* console.log(dateInput) */
    // Create a new Date object from the input date string
    const dateObj = new Date(dateInput);
    /* console.log(dateObj.toLocaleDateString('en-US', setting)) */
    // Use the toLocaleDateString() method to format the date object as a string
    // with the specified formatting options, using the "en-US" locale
    return dateObj.toLocaleDateString('en-US', setting);
}

export function parseDateString(dateString) {
    dateString = dateString.replace(' at', ' ')

    const dateObj = new Date(dateString.replace(' at', ' '));

    return dateObj;
}