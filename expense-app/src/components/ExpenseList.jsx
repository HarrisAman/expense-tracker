// ExpenseList.jsx renders a list of expense items and handles the editing state for each item.

import ExpenseItem from "./ExpenseItem"; // import ExpenseItem component to render each expense item in the list
import { groupByDay, formatDay, formatCurrency } from "../lib/sharedLogic"; // import helper format functions 


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

  return ( // draws all this data
    <div>
        {groupByDay(expenses).map((group) => ( // for each box (map builds a JSX array - a section per day)
            // group.items is the array of expenses for one day (takes sum, e - the running total and the current expense e)
            <section key={group.key}> 
                <h2>
                  {formatDay(group.key)} ({formatCurrency(group.total)})
                </h2>
                <ul> 
                  {group.items.map((expense) => ( // .map() array method that runs a function on each expense returning an new array of ExpenseItem components, each with a unique key prop (expense._id) and the expense object passed as a prop
                    // each expense becomes an ExpenseItem element 
                    <ExpenseItem
                      // key is a special prop React uses interally to track which item is which (_id is perfect as always unique)
                      key={expense._id} // when the list changes, added/deleted/edited, REACT compares keys to update only the rows that changed
                      expense={expense} // passing the expense object as a prop to the ExpenseItem component to be displayed
                      isEditing={editingId === expense._id} // boolean indicating whether the current expense item is being edited (true if the editingId matches the expense._id) why
                      // these four are callback functions passed down to ExpenseItem to handle the edit, cancel, save, and delete actions for each expense item
                      onEdit={onEdit}
                      onCancel={onCancel}
                      onSave={onSave}
                      onDelete={onDelete}
                    />
                  ))}
                </ul>
            </section>
          ))}
      </div>
  );
}