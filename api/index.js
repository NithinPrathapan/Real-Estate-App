import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import listingRouter from "./routes/listing.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

const __dirname = path.resolve();

app.use(
  cors({
    origin: ["https://mern-estate-c7gd.onrender.com", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser(process.env.SECRET, { secure: true }));
app.use(express.static(path.join(__dirname, "/client/dist")));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to Mongoose");
  })
  .catch((err) => console.log(err));

const port = 8000;

app.listen(port, () => {
  console.log("server listening on port", port);
});
