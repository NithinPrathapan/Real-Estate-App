import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const salt = 10;
  const hashedPassword = bcryptjs.hashSync(password, salt);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res
      .status(201)
      .json({ status: "success", message: "User saved successfully" });
    console.log(newUser);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
