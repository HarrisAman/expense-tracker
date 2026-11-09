// App.jsx is the main component of the app that manages the state and handles the API calls for creating, updating, and deleting expenses. 
// It also renders the ExpenseForm and ExpenseList components.

// useEffect is a React hook that is used to fetch data on startup
// useState remembers values between renders and triggers a re-render when they change
import { useEffect, useState } from "react"; 
import { getExpenses, createExpense, updateExpense, deleteExpense } from "./api"; // imports the API functions
import ExpenseForm from "./components/ExpenseForm"; // import two child components
import ExpenseList from "./components/ExpenseList";
import ExpenseCalendar from "./components/ExpenseCalendar.jsx";
import { expensesForDay } from "./lib/ExpenseCalendar.js";
import { today } from "./lib/ExpenseForm.js";
import { sortExpenses } from "./lib/ExpenseList.js"; // import helper sort expenses function

// declares the component 
export default function App() {
  // react re-renders the component with the new value [array destructuring]
  const [expenses, setExpenses] = useState([]); // list of expenses, initially empty array, returns current value and setter function
  const [loading, setLoading] = useState(true); // removes ambiguity when fetching expenses (true means the data hasnt arrived yet)
  const [error, setError] = useState(""); // error message, empty when there is none, any failed API call stores the message here
  const [editingId, setEditingId] = useState(null); // the id of the row being edited (null if none) keeping one id is App guarantees only one row can be edited at a time
  const [selectedDay, setSelectedDay] = useState(today());

  // fetch data on startup - useEffect()
  useEffect(() => {
    getExpenses() // returns a Promise from api.js
      .then(setExpenses) // when data arrives pass is to setExpenses, .then() is for when Promise succeeds (use the result)
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
  // shows the data on the page
  return ( // returns JSX allows me to do the following <main> is telling us this is the main content of the page
    <main> 
      <h1>Expense Tracker</h1>
      {error && <p role="alert">{error}</p>} 
      <ExpenseForm 
        key={selectedDay} 
        defaultDate={selectedDay} 
        onSubmit={handleCreate} 
      />
      <ExpenseCalendar 
        expenses={expenses} 
        selectedDay={selectedDay} 
        onSelectDay={setSelectedDay} 
        />
      {loading ? ( <p>Loading...</p> ) : (
        <ExpenseList
          expenses={expensesForDay(expenses, selectedDay)}
          editingId={editingId}
          onEdit={setEditingId}
          onCancel={() => setEditingId(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}

// line 85: if error message show on page, if not show nothing - error is the state string (reads the error variable) so 
// "" (empty string) when everything is fine or a error message. role="alert" is for shows that there was error even if you cant see the page
// line 86: renders my ExpenseForm component (the add form) - only one prop onSubmit is passed (the data)
// line 87: while loading is true show <p> tag, once the first fetch ends finally is set to false and shows <ExpenseList> 
// lines 90-96: expenses is the name{value} - ExpenseList reads it with ({expenses, ...}) so which data to show
// editingId shows which row shows the edit form, the onCallbacks let the children ask App to change state when user clicks
// onEdit is set to setEditingId because it gets called with an id already so its a direct pass
// onCancel gets called with nothing so its wrapped in a function with the setter set to null to stop the display of it being edited