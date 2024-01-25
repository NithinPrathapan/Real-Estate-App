import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to Mongoose");
  })
  .catch((err) => console.log(err));
const app = express();
app.use(express.json());
app.listen(3000, () => {
  console.log("server listening on port 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
