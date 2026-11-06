// accepts "YYYY-MM-DD", returns a Date or null if invalid
export function parseDate(value) { // helper function takes a value (whatever client sends as date)
  // if value is NOT a string OR does not match the format of that expression (date) .test() returns  T/F is values match the pattern
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null; // if so return null
  const d = new Date(value); // builds date object from text to keep everything consistent wherever the server runs
  if (Number.isNaN(d.getTime())) return null; // getTime() is NaN for an invalid date
  // checks if valid date, if not return null, if is return the date
  return d.toISOString().slice(0, 10) === value ? d : null;
}


const isTitle = (v) => typeof v === "string" && v.trim() !== "";
const isAmount = (v) => typeof v === "number" && Number.isFinite(v) && v > 0;

// Returns { data } or { error }. `now` is a parameter so tests can control "today".
export function validateNewExpense(body, now = new Date()) {

    // destructuring assignment to extract title, amount, and date properties from req.body object
    // from app.use(express.json())
    const { title, amount, date } = body ?? {};

    if (!isTitle(title)) {
        return { error: "Title is required and must be a non-empty string." };
    }
    if (!isAmount(amount)) {
        return { error: "Amount is required and must be a positive number." };
    }

    // default to today when no date is sent
    // now is the moment the request arrives
    // ISOString coverts date to text format
    // .slice() takes the first 10 characters
    // let because it can be reassigned in the if statement
    let expenseDate = new Date(now.toISOString().slice(0, 10)); // now is the moment the request arrives 
    if (date !== undefined) { // if client gives date (not undefined)
        const parsed = parseDate(date); // parseDate returns a date for good input stored in parsed
        if (!parsed) { // if parsed is no good returns error
            return res.status(400).json({ error: "Date must be in YYYY-MM-DD format." }); // if date is invalid throw error
        }
        expenseDate = parsed; // overwrites the default date with the parsed date (why let was used)
    }

    return { data: { title: title.trim(), amount, date: expenseDate } };
}

// Only fields that were sent are validated and returned
export function validateExpenseUpdate(body) {
  const { title, amount, date, isActive } = body ?? {}; // req.body says to change the title, amount, isActive, date (any combination)
  const data = {};

  if (title !== undefined) { // check if title is provided in the request body and validate them
    if (!isTitle(title)) return { error: "Title must be non-empty text." }; // if title is NOT a string OR IS an empty string, return errors
    data.title = title.trim(); // adds the title property to the updates object after trimming
  }
  if (amount !== undefined) { // check if amount is provided in the request body and validate it
    if (!isAmount(amount)) return { error: "Amount must be a positive number." }; // if amount IS NOT a number OR IS NaN (not a number) OR less than or equal to 0, return errors
    data.amount = amount; // adds the amount property to the data object
  }
  if (date !== undefined) { // if client gives date (not undefined)
    const parsed = parseDate(date); // parseDate returns a date for good input stored in parsed
    if (!parsed) return { error: "Date must be a valid date in YYYY-MM-DD format." }; // if parsed is no good returns error
    data.date = parsed; // overwrites the default date with the parsed date (why let was used)
  }
  // 0 is FALSE and 1 is TRUE, so if isActive is provided, check if it is either 0 or 1
  if (isActive !== undefined) { // check if isActive is provided in the request body and validate it
    if (isActive !== 0 && isActive !== 1) return { error: "isActive must be 0 or 1." }; // if isActive is NOT 0 AND NOT 1, return errors
    data.isActive = isActive; // adds the isActive property to the date object
  }

  // if updates object is empty (no valid fields to update), return 400 error with message
    // .keys() returns an array of the object's property names
    if (Object.keys(data).length === 0) { // .length checks how many properties are in the updates object - if 0, then nothing to update
        return res.status(400).json({ error: "Nothing to update" });
    }
}