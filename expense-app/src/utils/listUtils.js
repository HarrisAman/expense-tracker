import { dayKey } from "./formatters.js";

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
  for (const expense of sortExpenses(expenses)) { // a loop that visits each expense in order - for each expense in expenses
    const key = dayKey(expense); // works out which day the current expense belongs to, stored as key variable
    let group = groups[groups.length - 1]; // takes the last bucket puts in group variable and can be reassigned (look at most recent box)
    if (!group || group.key !== key) { // if group is empty (no box) OR it doesnt match (different day)  
      group = { key, items: [] }; // make a new box and set to group (items: [Coffee, Tea])
      groups.push(group); // push that  into pile (groups)
    }
    group.items.push(expense); // push the expense in the current box
  }
  return groups.map((g) => ({ ...g, total: sumAmounts(g.items) })) // builds new array where each bucket is copied and given a total
}