import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js"; // 👈 ESM requires .js extension after TS compilation
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";
// Get proper __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = ENV.PORT || 5000;
connectDB()
    .then(() => {
    // Serve frontend build (Render-friendly)
    const frontendPath = path.join(__dirname, "../../frontend/dist");
    app.use(express.static(frontendPath));
    // ✅ Use this instead of app.get('*', …)
    app.use((_req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
    // Start server
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
})
    .catch((err) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
});
