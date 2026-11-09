// ExpenseItem.jsx loops the whole array and renders each expense item and the changes.

import { useState } from "react"; // import useState to build inline inputs
import { formatCurrency, formatDay, dayKey } from "../lib/sharedLogic";
import { formatDateTime, statusLabel  } from "../lib/ExpenseItem.js"; // import helper format functions
import ExpenseForm from "./ExpenseForm.jsx";

// function ExpenseItem takes 6 props: (properties passed from parent component App.jsx)
// expense: the expense object to be rendered (array)
// isEditing: boolean indicating whether the expense item is currently being edited
// onEdit: function that is called when the edit button is clicked for an expense item - passed from parent component (ExpenseList.jsx) and handles the editing state
// onCancel: function that is called when the cancel button is clicked for an expense item - passed from parent component (ExpenseList.jsx) and handles the cancel action (hides the form)
// onSave: function that is called when the save button is clicked for an expense item - passed from parent component (ExpenseList.jsx) and handles the API call to update the expense
// onDelete: function that is called when the delete button is clicked for an expense item - passed from parent component (ExpenseList.jsx) and handles the API call to delete the expense
export default function ExpenseItem({ expense, isEditing, onEdit, onCancel, onSave, onDelete }) {

  // hooks to show the inline details
  const [showDetails, setShowDetails] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false); 

  if (isEditing) { // if this row is being edited, return the edit version
    return ( // if isEditing is true, render the ExpenseForm component for editing the expense item
      <li> 
        <ExpenseForm
          initial={expense} // passing intial put the form in edit mode with the current expense values
          onSubmit={(changes) => onSave(expense._id, changes)} // onSubmit takes the changes to the specific expense and saves it
          onCancel={onCancel} // makes the cancel button appear
        />
      </li>
    );
  }

  // if isEditing was false, render the expense item with its title, amount, created date, and edit/delete buttons
  return ( // <span> is an inline element that is used to group the text and buttons together
    <li>
      <div className="row">
        <span className="summary"> 
          {expense.title}: {formatCurrency(expense.amount)}{" "} 
        </span>

        <button
          type="button"
          className="secondary"
          aria-expanded={showDetails}
          onClick={() => setShowDetails((open) => !open)}
        >
          {showDetails ? "Hide" : "Details"}
        </button>

        <button
          type="button"
          className="secondary"
          onClick={() => onEdit(expense._id)}>
          Edit
        </button>

        {confirmingDelete ? (
          <>
            <span className="confirm-text">Delete this expense?</span>
            <button 
              type="button" 
              className="delete" 
              onClick={() => onDelete(expense._id)}>
              Yes, delete
            </button>

            <button 
              type="button" 
              className="secondary" 
              onClick={() => setConfirmingDelete(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button 
            type="button" 
            className="delete" 
            onClick={() => setConfirmingDelete(true)}>
            Delete
          </button>
        )}
  
      </div>
      {showDetails && (
        <dl className="details">
          <dt>Date</dt>
          <dd>{formatDay(dayKey(expense))}</dd>
          <dt>Created</dt>
          <dd>{formatDateTime(expense.createdAt)}</dd>
          <dt>Last updated</dt>
          <dd>{formatDateTime(expense.updatedAt)}</dd>
          <dt>Status</dt>
          <dd>{statusLabel(expense)}</dd>
        </dl>
      )}
    </li>
  );
}
// add comment changes
// line 28: expense.title inserts the title, followed by the $amount formatted the number to 2 decimal places
// <small> is for rendering smaller text
// line 30: converts the string back into a date object and formats it to a local time zone
// line 33-34: passing the functions down but waits to be clicked first then calls the function with the expense._id
// as an argument to identify which expense item to edit or delete