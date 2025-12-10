import express from "express";
import { connectDb } from "./db/db.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express();
const port=process.env.PORT || 3000
dotenv.config()

app.use(
  cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


connectDb()


import noteRouter from "./routes/notes.routes.js";
import userRouter from "./routes/user.routes.js";
import rateLimit from "express-rate-limit";
import { noteLimiter } from "./middleware/rateLimiter.js";

app.use("/api/notes/",noteLimiter ,noteRouter);
app.use("/api/user/", userRouter);


app.use((err, req, res, next) => {
  console.error(err);

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
    errors: err.errors || [],
  });
});
app.listen(port, () => {
  console.log("Hello sever started on port",port);
});

