import { useEffect, useState } from "react";
import { getExpenses, createExpense, updateExpense, deleteExpense } from "../services/expensesApi.js";
import { sortExpenses } from "../utils/listUtils.js";

export function useExpenses() {
  const [expenses, setExpenses] = useState([]); // list of expenses, initially empty array, returns current value and setter function
  const [loading, setLoading] = useState(true); // removes ambiguity when fetching expenses (true means the data hasnt arrived yet)
  const [error, setError] = useState(""); // error message, empty when there is none, any failed API call stores the message here
  const [editingId, setEditingId] = useState(null); // the id of the row being edited (null if none) keeping one id is App guarantees only one row can be edited at a time
  
    // fetch data on startup - useEffect()
    useEffect(() => {
        getExpenses() // returns a Promise from api.js
        .then((list) => setExpenses(sortExpenses(list))) // when data arrives pass is to setExpenses, .then() is for when Promise succeeds (use the result)
        .catch((err) => setError(err.message)) // if request fails save the message in error, Promise fails (handle the error)
        .finally(() => setLoading(false)); // either way (after succes or failure - do this)
    }, []); // empty array means run once, after first render

    // 3 handlers: call API, if succeed, update state
    // handleCreate adds a new expense to the top, returns T/F so ExpenseForm knows whether to clear inputs
    async function handleCreate(data) { // data is { title, amount } from ExpenseForm
      try { // try/catch block that sends the POST and waits
        const created = await createExpense(data); // created is the saved expense from my route
        // Adds it to the top taking the old state then [created, ...prev] builds a new array (new item then spread copy of old ones)
        setExpenses((prev) => sortExpenses([created, ...prev])); // sortExpenses takes that array, makes a copy and returns a sorted version
        setError(""); // on success clear old error and return true
        return true;
      } catch (err) { // on failure api.js thorws error and carries the error message and return false
        setError(err.message);
        return false; // ExpenseForm uses the boolean to decide whether to clear the inputs
      }
    }

    // calls API, swaps updated expense into list with map and closes edit form
    async function handleSave(id, changes) { // id for which expense to update, and what changes to make to the object (req.body)
      try {
        const updated = await updateExpense(id, changes); // sends the PUT and receive the updated document from route
        // replaces one expense in the list with its updated version, leaving everything else untouched
        // setExpenses makes React re-render, passes in the latest list (prev) builds new array with .map(), e is the current expense
        // if this expense id matches for the one that is edited, use updated (the change) otherwise keep it the same
        // if the date was changed then it will sort it and move it to the correct day group
        setExpenses((prev) => sortExpenses(prev.map((e) => (e._id === id ? updated : e))));
        setEditingId(null); // closes the editing form so the row returns to display mode
        setError(""); // on success clear old error and return true
        return true; // the T/F only needed to tell ExpenseForm whether or not to clear inputs so not needed for update
      } catch (err) {
        setError(err.message);
        return false;
      }
    }

    // confirm to delete expense, call API to remove, remove from screen
    async function handleDelete(id) { // takes the id of the expense so it knows what to remove
      try {
        await deleteExpense(id); // calls API and runs deleteOne()
        setExpenses((prev) => prev.filter((e) => e._id !== id)); // updating list on screen, .filter() builds a new array keeping only the true items - every expense who'd id is not the deleted one
        setError(""); // on success clear old error
      } catch (err) {
        setError(err.message);
      }
    }

  return { expenses, loading, error, editingId, setEditingId, handleCreate, handleSave, handleDelete };
}