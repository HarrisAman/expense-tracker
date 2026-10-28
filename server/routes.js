import { Router } from "express"; //imports Router class from express package, it holds routes (let me keep expense routes in this file as opposed to index.js file)
import { db } from "./db.js"; // imports db variable from db.js file, need the database to save data

const router = Router(); // create router variable to hold the instance of Router class and attach handlers

// registers a handler for POST requests (method to create something)
// "/" is the path for the route, which is relative to the base path of the router 
// (req, res) two objects Express provides to handle the request and response: 
// req contains information about the incoming request / res is used to send a response back
router.post("/", async (req, res) => { 
    
    // destructuring assignment to extract title and amount properties from req.body object
    // from app.use(express.json())
    const { title, amount } = req.body;
    
    // validation if title IS NOT a string OR IS an empty string, return errors
    if (typeof title !== "string" || title.trim() === "") {     // trim() removes whitespace
        // res.status(400) sets HTTP status code to 400 (Bad Request) and .json() sends a JSON response with an error message
        return res.status(400).json({ error: "Title is required and must be a non-empty string." });
    }

    // if amount IS NOT a number OR IS less than or equal to 0, return errors
    if (typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({ error: "Amount is required and must be a positive number." });
    }

    // 
    const doc = { title: title.trim(), amount };  // create new object doc with title and amount fields (allows me to build the doc myself)
    // db.collection("expenses") accesses the expenses collection in the database, 
    // and .insertOne(doc) inserts the doc object into the collection
    // it returns a Promise that resolves and awaits until confirmed - all stored in result variable
    const result = await db.collection("expenses").insertOne(doc) 

    // res.status(201) sets HTTP status code to 201 (Created) and .json() sends a JSON response with the 
    // inserted document's ID and the original doc object using spread operator
    // these id are generated from MongoDB and are unique identifiers for each document in the collection.
    res.status(201).json({ _id: result.insertedId, ...doc }); // NEED THE _id to edit or delete expense.
});

router.get("/", async (req, res) => { // all the same .get() is handler for reading data, wont use req because not needed (for syntax)
  // .find() builds query to retrieve all documents in the expenses collection
  // and .toArray() converts the result to an array of documents
  // stores in expenses variable and awaits until the query is complete
  const expenses = await db.collection("expenses").find().toArray(); 
  // converts the result to an array of documents and sends it as a JSON response to the client (browser)
  res.json(expenses);
});











export default router; // allows export to other files
