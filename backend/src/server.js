import express from "express";
import { connectDb } from "./db/db.js";
import dotenv from "dotenv"


const app = express();
const port=process.env.PORT || 3000
dotenv.config()


connectDb()


import noteRouter from "./routes/notes.routes.js";

app.use("/api/notes/", noteRouter);
app.listen(port, () => {
  console.log("Hello sever started on port",port);
});

