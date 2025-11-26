import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js"; // 👈 ESM requires .js extension
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

// Get proper __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = ENV.PORT || 5000;

// Connect to Database
connectDB()
  .then(() => {
    console.log("✅ Database connected successfully");

    // Start the Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Ready to accept requests from your frontend`);
    });
  })
  .catch((err: unknown) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  });