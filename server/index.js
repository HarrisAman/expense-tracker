// server/index.js is for loading .env and connecting to MongoDB and calling listen

import "dotenv/config"; // reads server/.env file and copies each KEY=value line to process.env (must be first import so variables exist before other code reads)
import app from "./app.js"; // imports app from app.js file, which contains the express app and middleware/routes
import { connectToMongoDB } from './db.js'; // imports from db.js file

// PORT variable is set to the value of the PORT environment variable from .env file OR 5000 as default.
const PORT = process.env.PORT || 5000;

// async function named start - to start connection
async function start() {
  try {                       // try/catch block to attempt to connect to database
    await connectToMongoDB(); // connects to database - returns Promise as it takes time
    // .listen() starts my server and opens a PORT to accept HTTP requests - if successful prints message
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {             // if cant connect throws error and prints error message
    console.error("Failed to start server:", err.message);
    process.exit(1); // terminates node if fails (0 means success, anything else is failure)
  }
}

start(); // calling the function to start connection