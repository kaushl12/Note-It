import dotenv from "dotenv";
dotenv.config(); // ✅ FIRST

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { connectDb } from "./db/db.js";
import noteRouter from "./routes/notes.routes.js";
import userRouter from "./routes/user.routes.js";
import { noteLimiter } from "./middleware/rateLimiter.js";

const app = express();
const port = process.env.PORT || 3000;

// =====================
// Middleware
// =====================
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(","), // ✅ scalable
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =====================
// Routes
// =====================
app.use("/api/notes", noteLimiter, noteRouter);
app.use("/api/user", userRouter);

// =====================
// Global Error Handler
// =====================
app.use((err, req, res, next) => {
  console.error(err.stack); // ✅ log error

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

// =====================
// Server + DB Start
// =====================
const startServer = async () => {
  try {
    await connectDb(); // ✅ wait for DB
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
