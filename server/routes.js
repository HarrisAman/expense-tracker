import { Router } from "express"; //imports Router class from express package, it holds routes (let me keep expense routes in this file as opposed to index.js file)
import { db } from "./db.js"; // imports db variable from db.js file, need the database to save data
import { ObjectId } from "mongodb"; // imports ObjectId class from mongodb package, used to convert string to ObjectId for MongoDB queries

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

// GET request for a specific id endpoint
// id is now the placeholder for the route parameter
// which is a variable part of the URL that can be accessed using req.params object
router.get("/:id", async (req, res) => { 

  const { id } = req.params; // object holding the route parameters (req.params = id)
  // if NOT ObjectId.isValid(id) - checks if the id is a valid ObjectId format
  // if not return 400 error with message
  if (!ObjectId.isValid(id)) { // ObjectId is a 24 character hex string (key id) - isValid() is a method that checks if a value could be turned into an ObjectId
    return res.status(400).json({ error: "Invalid id" });
  }

  // findOne() method searches for a single document in the expenses collection that matches the query { _id: new ObjectId(id) }
  // points to same expenses collection, waits for database response and stores in expense variable
  const expense = await db.collection("expenses").findOne({ _id: new ObjectId(id) }); // converts URL string into an ObjectId object so MongoDB can read it

  // if NO expense (nothing matches) - return 404 error (not found) - meaning no expense has that _id
  if (!expense) {
    return res.status(404).json({ error: "Expense not found" });
  }

  // send the response result as JSON and _id is converted to string
  res.json(expense);
});

// PUT request for specific id endpoint (updating expenses)
router.put("/:id", async (req, res) => {
    // do stuff can use .updateOne()
    const { id } = req.params;
    const { title, amount } = req.body;

    if (!ObjectId.isValid(id)) { // ObjectId is a 24 character hex string (key id) - isValid() is a method that checks if a value could be turned into an ObjectId
        return res.status(400).json({ error: "Invalid id" });
    }

    const updates = {};

    if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ error: "Title must be non-empty text" });
        }
        updates.title = title.trim();
    }

    if (amount !== undefined) {
        if (typeof amount !== "number" || Number.isNaN(amount)) {
            return res.status(400).json({ error: "Amount must be a number" });
        }
        updates.amount = amount;
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "Nothing to update" });
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "Nothing to update" });
    }

    const result = await db.collection("expenses").updateOne({ _id: new ObjectId(id) }, { $set: updates });

    if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Expense not found" });
    }

    const updated = await db.collection("expenses").findOne({ _id: new ObjectId(id) });
    
    res.json(updated);
});

// DELETE request for id endpoint (for removing)
router.delete("/:id", async (req, res) => {

    const { id } = req.params; // the id itself will tell what to remove

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid id" });
    }

    // deleteOne() removes the first expense that matches the _id
    // stores result in the result variable
    const result = await db.collection("expenses").deleteOne({ _id: new ObjectId(id) });
    
    // deletedCount is how many expenses were removed 1 if id existed, 0 is nothing
    // if result is 0, there was no id
    if (result.deletedCount === 0) { // deletedCount from MongoDB a property on the object that deleteOne returns
        return res.status(404).json({ error: "Expense not found" }); // return error if _id not found
    } 

    // sends JSON with a message that the specific id was deleted (expense)
    res.json({ message: "Expense deleted", id });
});

export default router; // allows export to other files
