// expense-app/src/components/ExpenseForm.jsx for adding new expenses and editing existing expenses
// useState in this case is used for form inputs and app state (the data my app remembers)
import { useState } from "react"; // useState is a React hook that allows me to add state to functional components. Returns an array with two elements: current state value and a function to update it

// declaring ExpenseForm component as function taking 3 props:
// initial: object with the initial values for the form fields (title/amount) - used when editing an existing expense
// onSubmit: function that is called when the form is submitted - passed from parent component (App.jsx) and handles the API call to create or update the expense
// onCancel: function that is called when the cancel button is clicked - passed from parent component (App.jsx) and handles the cancel action (hides the form)
export default function ExpenseForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title ?? ""); // useState hook to create a state variable title and a function setTitle to update it
  const [amount, setAmount] = useState(initial?.amount ?? ""); // useState hook to create a state variable amount and a function setAmount to update it

  // handleSubmit function is called when the form is submitted - calls the onSubmit prop with the current title and amount values
  async function handleSubmit(e) { // e is the event object that is passed to the function when the form is submitted
    e.preventDefault(); // click, keystrokes, submitting a form, etc. - preventDefault() method prevents the default action of the event from being triggered (page reload)
    const ok = await onSubmit({ title, amount: Number(amount) }); // calls the onSubmit prop with an object containing the current title and amount values (amount is converted to a number using Number() function)
    if (ok && !initial) { // if onSubmit returns true (ok) and initial is false (not editing an existing expense), reset the form fields to empty strings
      setTitle("");
      setAmount("");
    }
  }


  // line 28: a components returns JSX so line 27 attaches my handler, fires on click of submit button 
  // line 29-31 attaches the state variables to the input fields and updates them on change 
  // controlled input, value={title} makes input always display the state, e.target is the current input element and e.target.value is the current value of the input element
  // placeholder is the text that appears in the input field when it is empty, required makes the input field required (cannot be empty)
  // step allows cents values, min prevents negative values
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        type="number"
        step="0.01"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />
      <button type="submit">{initial ? "Save" : "Add expense"}</button>
      {onCancel && (
        <button type="button" onClick={onCancel}>Cancel</button>
      )}
    </form>
  );
}

// line 46: the submit button, if initial is true (editing an existing expense), the button text is "Save", otherwise it is "Add expense" (adding a new expense)
// line 47-48: if onCancel prop is provided, render a cancel button that calls the onCancel function when clicked
// type="button" is used to prevent the button from submitting the form when clicked