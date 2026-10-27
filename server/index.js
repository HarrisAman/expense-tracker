// server/index.js file most code from MongoDB Atlas to show how to connect to the cluster

import "dotenv/config"; // reads server/.env file and copies each KEY=value line to process.env (must be first import so variables exist before other code reads)
import { MongoClient } from 'mongodb'; // Import the MongoClient class from the mongodb package (installed mongdodb)

const client = new MongoClient(process.env.MONGODB_URI); 
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await client.close();
}