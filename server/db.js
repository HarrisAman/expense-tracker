// server/db.js file most code from MongoDB Atlas to show how to connect to the cluster

import "dotenv/config"; // reads server/.env file and copies each KEY=value line to process.env (must be first import so variables exist before other code reads)
import { MongoClient } from 'mongodb'; // Import the MongoClient class from the mongodb package (installed mongodb)

// new builds an object from the MongoClient class, which is used to connect to MongoDB database (only used to store). All stored in client variable
const client = new MongoClient(process.env.MONGODB_URI);

// client.db() method returns name of the database as expense-app, stores in db variable and can be exported to use in other files
export const db = client.db("expense-app");

// async allows await to be used - this function returns a Promise to connect to database.
export async function connectToMongoDB() {
  try {                     // try/catch block to handle errors               
    await client.connect(); // wait pauses function for the connection to be established with .connect().
    console.log("You successfully connected to MongoDB!"); // log if connected (only works if line 15 works aka didnt jump to catch due to error)
  } catch (err) {           // if error occured catch block runs and creates a variable err
    console.error(err);     // log the error to console using .error() built-in method
    throw err;              // re-throw the error so it can be handled by the caller of connectToMongoDB() function (index.js)
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await client.close();     // close the connection using .close() method. Returns Promise so await is used to pause function until connection is closed.
}

// Some comments on async/await and Promises:
// Connecting to Atlas takes time, JS wont stop and wait for me unless I tell it to.
// Using async/await allows me to tell the async function to wait. 