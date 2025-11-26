import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { ENV } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import propertyRoutes from "./modules/properties/property.routes.js";
import interestRoutes from "./modules/interests/interest.routes.js";

const app = express();

// --- Security & Core Middleware ---
app.use(helmet());

// 1️⃣ Define your allowed origins
const allowedOrigins = [
  "http://localhost:5173", // For local development
  "https://real-estate-app-1-gbzy.onrender.com" // 👈 YOUR FRONTEND URL
];

// 2️⃣ FIX: Use the array to validate origin dynamically
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // This allows cookies/sessions to work
}));

app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// --- Health Check Route ---
app.get("/", (_req, res) => {
    res.json({ message: "🏡 Real Estate API Running" });
});

// --- API Routes ---
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/interests", interestRoutes);

// --- Global Error Handler ---
app.use(errorHandler);

export default app;