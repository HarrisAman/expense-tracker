// expense-app/src/api.js is the only file that talks to the server, it is the API for the client (browser) to talk to the server (backend). It is a wrapper around fetch() to make it easier to use and handle errors. 
// It is imported into App.jsx and used to make requests to the server.
// Components call these functions but never write fetch() directly. This is a good practice because it separates the concerns of the client and server, and makes it easier to change the server API without changing the client code.

const BASE = `${import.meta.env.VITE_API_URL}/api/expenses`; // reads variables from .env file and constructs the base URL for the API endpoints.

// helper function to make requests to the server and handle errors. It takes a URL and options object as parameters
// and returns a Promise that resolves to the JSON response data or throws an error if the request fails.
async function request(url, options) {
  const res = await fetch(url, options); // fetch() is a built-in function that makes HTTP requests to the server and returns a Promise that resolves to the Response object representing the response to the request
  const data = await res.json(); // reads the body of the server and turns JSON into JS object - data holds all my requests
  if (!res.ok) throw new Error(data.error || "Request failed"); // if response is not ok (status code is not 2xx), throw an error with the message from the server or a default message
  return data; // on success return data back to the caller (App.jsx) to use in the component
}

// Four arrow functions that wrap the request() function to make it easier to use and handle errors
// Each function corresponds to a specific API endpoint and HTTP method (GET, POST, PUT, DELETE)

// return array of expenses
export const getExpenses = () => request(BASE); // no options object needed because GET is the default method for fetch() and no body is needed for GET requests

// create expenses
export const createExpense = (expense) =>
  request(BASE, { // request URL
    method: "POST", // matches router.post
    headers: { "Content-Type": "application/json" }, // headers tells Express body is JSON (txt format for repping data)
    body: JSON.stringify(expense), // JSON.stringify() converts object into JSON text (fetch only sends strings not objects)
  });

// updates expenses
// URL includes the id of the expense to update and changes is an object with the updated fields (req.params.id)
// changes becomes req.body in the server (router.put) and is used to update the document in the database
export const updateExpense = (id, changes) => 
  request(`${BASE}/${id}`, { // '${}${}' is a template literal - building a string w variable values inserted
    method: "PUT", // matches router.put
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });

// deletes expenses
export const deleteExpense = (id) => // deletes with the id in the URL
  request(`${BASE}/${id}`, { method: "DELETE" }); // no body or headers needed