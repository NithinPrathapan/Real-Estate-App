import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const signin = async (req, res, next) => {
  console.log("signin function called");
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      next(errorHandler(404, "User not found.. Plese create an account"));
      return;
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword)
      return next(errorHandler(401, "Invalid email or password "));

    const token = jwt.sign({ id: validUser._id }, process.env.SECRET);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 3600000,
    });

    const { password: pass, ...rest } = validUser._doc;
    res.status(200).json({ message: "Login successful", data: rest, token });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      console.log("user exists");
      const token = jwt.sign({ id: userExist._id }, process.env.SECRET);
      const { password: pass, ...rest } = userExist._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
      return;
    } else {
      console.log("new user creation");
      const generatePassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({
        username: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt
        .sign({ id: newUser._id }, process.env.SECRET)
        .json(rest);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(newUser);
      console.log("new user saved ggogle");
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out");
  } catch (error) {
    next(error);
  }
};
