// today as YYYY-MM-DD in the user's local time stored in variable
export const today = () => new Date().toLocaleDateString("en-CA");

// starting values; `initial` is an existing expense, or undefined when adding
export function initialFormValues(initial) {
    return {
        title: initial?.title ?? "", // useState hook to create a state variable title and a function setTitle to update it
        amount: initial?.amount ?? "", // useState hook to create a state variable amount and a function setAmount to update it
        // if not initial or no date whole thing is undefined. date arrives as ISO string so slice cuts to 10 characters, fallback to today
        date: initial?.date?.slice(0, 10) ?? today(), // useState hook to create a state variable date and a function setDate to update it
    };
}

// input strings -> the payload the API expects
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