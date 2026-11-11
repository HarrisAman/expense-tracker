// today as YYYY-MM-DD in the user's local time stored in variable
export const today = () => new Date().toLocaleDateString("en-CA");

// starting values; `initial` is an existing expense, or undefined when adding
export function initialFormValues(initial, defaultDate) { // defaultDate shows calendars selected day
    return {
        title: initial?.title ?? "", // optional chaining if initial is undefined it gives undefined or empty
        amount: initial?.amount ?? "",
        // if not initial or no date whole thing is undefined. date arrives as ISO string so slice cuts to 10 characters, fallback to today
        date: initial?.date?.slice(0, 10) ?? defaultDate ?? today(), // or just the default date provided
    };
}

// input strings - the payload the API expects
export function toPayload({ title, amount, date }) {
    return { 
        title, 
        amount: Number(amount), 
        date };
}

// after a successful add: clear title and amount, keep the date
export function valuesAfterAdd(values) {
    return { 
        ...values, 
        title: "", 
        amount: "" };
}