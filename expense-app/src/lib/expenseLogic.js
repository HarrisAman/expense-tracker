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
    return expense.date ? expense.date.slice(0, 10) : "None";
}

// sorts expenses together by day
export function sortExpenses(list) { // takes an array of expenses
    return [...list].sort( // returns a copied array into new one then .sort mutates it newest date first, same date newest created
        // takes two items a, b and returns a number (a.date/b.date are ISO strings - "2026-10-23T00:00:00.000Z", 
        // if b.date is missing use empty string, and splice to first 10 chars
        // if a.date is missing use empty string, and splice to first 10 chars
        // compare the local _ids as strings and returns negative or positive (negative for left string, pos for right)
        // if its identical (0) compares the _ids as text (the ObjectId timestamps)
        // larger id means created later (show first)
        (a, b) => (b.date || "").slice(0, 10).localeCompare((a.date || "").slice(0, 10)) || b._id.localeCompare(a._id) // explain this 
  );
}

// adds up list items and return the total in dollars with cents
export function sumAmounts(items) { // function items as an array of expense objects (one days buckets)
    // e.amount*100 converts dollars to cents, Math.round rounds to a whole number - sum adds this expense to the running total
    // items.reduce runs the array - sum is the running total and e is the current expense being added, 0 would be the starting value
    const cents = items.reduce((sum, e) => sum + Math.round(e.amount * 100), 0); // stored in cents variable
    return cents / 100; // return the dollar value back (1850 becomes 18.5)
}

// function to group expenses together by day
export function groupByDay(expenses) {
    // expenses arrive sorted by date, so same day items are together
  const groups = []; // empty array that will hold buckets (related items)
  for (const expense of expenses) { // a loop that visits each expense in order - for each expense in expenses
    const key = dayKey(expense); // works out which day the current expense belongs to, stored as key variable
    let group = groups[groups.length - 1]; // takes the last bucket puts in group variable and can be reassigned (look at most recent box)
    if (!group || group.key !== key) { // if group is empty (no box) OR it doesnt match (different day)  
      group = { key, items: [] }; // make a new box and set to group (items: [Coffee, Tea])
      groups.push(group); // push that  into pile (groups)
    }
    group.items.push(expense); // push the expense in the current box
  }
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

// function to format ISO date time to readable dates
export function formatDateTime(iso) { // takes the iso parameter from the API
    // converts iso string into Date object and formats to local date/tiume otherwise return unknown
    return iso ? new Date(iso).toLocaleString("en-US") : "Unknown";
} 