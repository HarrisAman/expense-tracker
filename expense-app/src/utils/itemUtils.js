// function to format ISO date time to readable dates
export function formatDateTime(iso) { // takes the iso parameter from the API
    // converts iso string into Date object and formats to local date/time otherwise return unknown
    return iso ? new Date(iso).toLocaleString("en-US") : "Unknown";
} 


// turns stored isActive into a label
export const statusLabel = (expense) => (expense.isActive === 1 ? "Active" : "Inactive");