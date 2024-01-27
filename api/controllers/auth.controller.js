import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  const { username, email } = req.body;
  const salt = await bcryptjs.genSalt(10);
  const password = req.body.password;
  const hashedPassword = await bcryptjs.hashSync(password, salt);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({
      status: "success",
      message: "User saved successfully",
    });

    console.log(newUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: "failed", message: error.message });
    next(error);
  }
};
