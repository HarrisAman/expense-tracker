import "dotenv/config"; // reads server/.env file and copies each KEY=value line to process.env (must be first import so variables exist before other code reads)
import {connectToMongoDB, disconnectFromMongoDB} from './db.js'; // imports from db.js file
import express from "express"; // imports express which allows me to receive requests and send responses to the client (browser)
import cors from "cors"; // imports cors which lets my browser reads responses from the server (fetch would not work - browser security feature) 
import expenseRoutes from "./routes.js"; // imports expenseRoutes from routes.js file, which contains the routes for the expenses API

// creating app the central object all middleware, routes, and the calls attach to it (const because can not be changed)
const app = express(); // (express() is a function) creates an instance of express app, which is used to handle requests and responses. All stored in app variable
// PORT variable is set to the value of the PORT environment variable from .env file OR 5000 as default.
const PORT = process.env.PORT || 5000;

// registers middleware function for the app. Middleware functions are functions that have access to the request and response objects,
// and can modify them or perform other actions before passing control to the next middleware function in the stack.
// CORS middleware which allows it to accept requests from different origins (domains). This is important for web applications that need to make requests to APIs hosted on different domains
app.use(cors());
// parses incoming requests with JSON payloads and makes the data available in req.body. This is important for APIs that receive data from clients in JSON format.
app.use(express.json());

app.get("/api/health", (req, res) => { // GET request to /api/health endpoint. Callback function takes two parameters: req (request object) and res (response object)
  res.json({status: "ok"}); // sends a JSON response with a status property set to "ok". This is often used as a health check endpoint to verify that the server is running and responsive.
});

app.use("/api/expenses", expenseRoutes); // attaches the expenseRoutes router to the main app at the "/api/expenses" path

async function start() {
  try {
    await connectToMongoDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();