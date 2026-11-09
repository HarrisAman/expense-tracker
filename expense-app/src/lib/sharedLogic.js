// function to format the amount inputted (5000 > $5,000.00)
export function formatCurrency(amount) { // takes 1 input (the number for format)
    // Number converts the amount to a number (so toLocaleString doesnt crash)
    const value = Number.isFinite(amount) ? amount : 0; // returns true if amount is real number - then use amount otherwise use 0.
    // Built in method that formats by locale rules, formarts as money, and which currency
    return value.toLocaleString("en-US", { style: "currency", currency: "USD" }); // return sends it back the string
}

// function thats turn into label of day it belongs to
export function dayKey(expense) { // takes 1 expense object
    // if expense.date (the date) exists take first 10 characters as key otherwise take none
    return expense.date ? expense.date.slice(0, 10) : "none";
}

// function to format the date to something more readable
export function formatDay(key) { // takes key value (date)
  if (key === "none") return "No date"; // expenses with no date return "invalid date" (for older documents and prevents crash)
  return new Date(`${key}T00:00:00Z`).toLocaleDateString("en-US", { // returns the date combining strings of key and T00:00:00Z converts to local readability and options
    timeZone: "UTC", // dates are stored at midnight UTC; avoids an off-by-one day
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric",
  });
}