// index.js
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });


import { app } from "./app.js";
import connectDB from "./db/db.js"; // ✅ make sure this path is correct

// Load environment variables

// Set the port
const PORT = process.env.PORT || 5000;

// Connect to the database and start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });