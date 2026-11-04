// ExpenseList.jsx renders a list of expense items and handles the editing state for each item.

import ExpenseItem from "./ExpenseItem"; // import ExpenseItem component to render each expense item in the list

// function to format the date to something more readable
function formatDay(key) { // takes key value (date)
  if (key === "none") return "No date"; // expenses with no date return "invalid date" (for older documents and prevents crash)
  return new Date(key + "T00:00:00Z").toLocaleDateString(undefined, { // returns the date combining strings of key and T00:00:00Z converts to local readability and options
    timeZone: "UTC", // dates are stored at midnight UTC; avoids an off-by-one day
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

// function ExpenseList takes 6 props: (properties passed from parent component App.jsx and child component ExpenseItem.jsx)
// expenses: array of expense objects to be rendered in the list
// editingId: id of the expense item that is currently being edited (if any)
// onEdit: function that is called when the edit button is clicked for an expense item - passed from parent component (App.jsx) and handles the editing state
// onCancel: function that is called when the cancel button is clicked for an expense item - passed from parent component (App.jsx) and handles the cancel action (hides the form)
// onSave: function that is called when the save button is clicked for an expense item - passed from parent component (App.jsx) and handles the API call to update the expense
// onDelete: function that is called when the delete button is clicked for an expense item - passed from parent component (App.jsx) and handles the API call to delete the expense
export default function ExpenseList({ expenses, editingId, onEdit, onCancel, onSave, onDelete }) {
  // expenses.length is the number of items
  if (expenses.length === 0) return <p>No expenses yet.</p>; // if the expenses array is empty, render a message indicating that there are no expenses yet

  // expenses arrive sorted by date, so same day items are together
  const groups = []; // empty array that will hold buckets (related items)
  for (const expense of expenses) { // a loop that visits each expense in order - for each expense in expenses
    const key = expense.date ? expense.date.slice(0, 10) : "none"; // if expense.date exists take first 10 characters as key
    let group = groups[groups.length - 1]; // takes the last bucket puts in group variable and can be reassigned (look at most recent box)
    if (!group || group.key !== key) { // if group is empty (no box) OR it doesnt match (different day)  
      group = { key, items: [] }; // make a new box and set to group (items: [Coffee, Tea])
      groups.push(group); // push that  into pile (groups)
    }
    group.items.push(expense); // push the expense in the current box
  }
  
  return ( // draws all this data
    <div>
        {groups.map((group) => { // for each box (map builds a JSX array - a section per day)
            // group.items is the array of expenses for one day (takes sum, e - the running total and the current expense e)
            const total = group.items.reduce((sum, e) => sum + e.amount, 0); // add up the amounts with reduce() (0 is the starting val)
            return ( // line 43: draws once section (day), key is required to track each one (day string is unique per group) - formatDay becomes Friday etc...
                <section key={group.key}> 
                    <h2>{formatDay(group.key)} (${total.toFixed(2)})</h2>
                    <ul> 
                        {group.items.map((expense) => ( // .map() array method that runs a function on each expense returning an new array of ExpenseItem components, each with a unique key prop (expense._id) and the expense object passed as a prop
                            // each expense becomes an ExpenseItem element 
                            <ExpenseItem
                            // key is a special prop React uses interally to track which item is which (_id is perfect as always unique)
                            key={expense._id} // when the list changes, added/deleted/edited, REACT compares keys to update only the rows that changed
                            expense={expense} // passing the expense object as a prop to the ExpenseItem component to be displayed
                            isEditing={editingId === expense._id} // boolean indicating whether the current expense item is being edited (true if the editingId matches the expense._id) why
                            // these four are callback functions passed down to ExpenseItem to handle the edit, cancel, save, and delete actions for each expense item
                            onEdit={onEdit} //
                            onCancel={onCancel}
                            onSave={onSave}
                            onDelete={onDelete}
                        />
                    ))}
                    </ul>
                </section>
            );
        })}
    </div>
  );
}