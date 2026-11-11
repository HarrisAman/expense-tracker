// App.jsx is the main component of the app that manages the state and handles the API calls for creating, updating, and deleting expenses. 
// It also renders the ExpenseForm and ExpenseList components.

// useEffect is a React hook that is used to fetch data on startup
// useState remembers values between renders and triggers a re-render when they change
import { useState } from "react"; 
import { useExpenses } from "./hooks/useExpenses.js"
import ExpenseForm from "./components/ExpenseForm"; // import two child components
import ExpenseList from "./components/ExpenseList";
import ExpenseCalendar from "./components/ExpenseCalendar.jsx";
import { expensesForDay } from "./utils/calendarUtils.js";
import { today } from "./utils/formUtils.js";

// declares the component 
export default function App() {
  const { expenses, loading, error, editingId, setEditingId, handleCreate, handleSave, handleDelete, } = useExpenses();
  const [selectedDay, setSelectedDay] = useState(today());

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