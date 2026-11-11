// server/validation.js holds the rules for what counts as a valid expense. Takes data and returns a result 

// accepts "YYYY-MM-DD", returns a Date or null if invalid
export function parseDate(value) { // helper function takes a value (whatever client sends as date)
  // if value is NOT a string OR does not match the format of that expression (date) .test() returns  T/F is values match the pattern
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null; // if bad format return null (error 400)
  const d = new Date(value); // builds date object from text to keep everything consistent wherever the server runs
  // rejects dates that have the right format but arent actual dates "2026-13-45"
  // d.getTime() returns a number, for a valid date you get number for invalid NaN
  if (Number.isNaN(d.getTime())) return null; // if date is invalid return null (error 400)
  // converts date back to text - checks if valid date, slice to first 10 chars and returns date, otherwise null
  return d.toISOString().slice(0, 10) === value ? d : null; 
}

// check functions that answer T/F
const isTitle = (v) => typeof v === "string" && v.trim() !== ""; // checks if title is string and no space after is valid
const isAmount = (v) => typeof v === "number" && Number.isFinite(v) && v !== 0; // checks if amount is number and isFinite and number is NOT 0

// body is req.body, now is new date (default paramaters)
export function validateNewExpense(body, now = new Date()) {

    // destructuring assignment to extract title, amount, and date properties from req.body object
    const { title, amount, date } = body ?? {}; // ?? {} if missing body and becomes empty

    // if title not valid return error 400
    if (!isTitle(title)) {
        return { error: "Title is required and must be a non-empty string." };
    }
    // if amount not valid return error 400
    if (!isAmount(amount)) {
        return { error: "Amount is required and must be a non-zero number." };
    }

    // default to today when no date is sent
    // now is the moment the request arrives
    // ISOString coverts date to text format
    // .slice() takes the first 10 characters
    // let because it can be reassigned in the if statement
    let expenseDate = new Date(now.toISOString().slice(0, 10)); // store in expenseDate variable 
    if (date !== undefined) { // if client gives date (not undefined)
        const parsed = parseDate(date); // validate date with parseDate and store in parsed variable
        if (!parsed) { // if parsed is no good returns error
            return { error: "Date must be a valid date in YYYY-MM-DD format." }; // if date is invalid throw error
        }
        expenseDate = parsed; // if all good overwrites the default date with the parsed date (why let was used)
    }
    // success returns new object for the data fields
    return { data: { title: title.trim(), amount, date: expenseDate } };
}

// validates updating expenses
export function validateExpenseUpdate(body) { // req.body
  const { title, amount, date, isActive } = body ?? {}; // isActive allows it to be changed active or not
  const data = {}; // data starts as empty and collects valid fields

  if (title !== undefined) { // check if title is provided in the request body and validate them
    if (!isTitle(title)) return { error: "Title must be non-empty text." }; // if title is NOT a string OR IS an empty string, return errors
    data.title = title.trim(); // adds the title property to the updates object after trimming
  }
  if (amount !== undefined) { // check if amount is provided in the request body and validate it
    if (!isAmount(amount)) return { error: "Amount must be a non-zero number." }; // if amount IS NOT a number OR IS NaN (not a number) OR less than or equal to 0, return errors
    data.amount = amount; // adds the amount property to the data object
  }
  if (date !== undefined) { // if client gives date (not undefined)
    const parsed = parseDate(date); // parseDate returns a date for good input stored in parsed
    if (!parsed) return { error: "Date must be a valid date in YYYY-MM-DD format." }; // if parsed is no good returns error
    data.date = parsed; // overwrites the default date with the parsed date (why let was used)
  }

  // 0 is FALSE and 1 is TRUE, so if isActive is provided, check if it is either 0 or 1
  if (isActive !== undefined) { // check if isActive is provided in the request body and validate it
    if (isActive !== 0 && isActive !== 1) return { error: "isActive must be 0 or 1." }; // if isActive is NOT 0 AND NOT 1, return error object
    data.isActive = isActive; // keeps the validated value in data object
  }

  // if updates object is empty (no valid fields to update), return 400 error with message
  // .keys() returns an array of the object's property names
  if (Object.keys(data).length === 0) {
      return { error: "Nothing to update." };
  }
  return { data }; // adds the updatedAt object
}