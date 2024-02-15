import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/lisitng.model.js";
import mongoose from "mongoose";

export const test = (req, res) => {
  res.json({
    message: "hellow what",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    if (!updateUser)
      return next(
        errorHandler(404, "User not updated, Please sign-in again and try")
      );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.log("++++++", error.message);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id !== req.user.id)
    return next(errorHandler(404, "You can only delete your account"));
  try {
    const userId = req.params.id;

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return next(errorHandler(404, "User not found"));
    }

    await User.findByIdAndDelete(userId);

    res
      .clearCookie("access_token")
      .status(201)
      .json({ message: "User deleted successfully" });

    console.log("user deleted successfully");
    
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const listings = await Listing.find({ userRef: req.user.id });
      console.log(listings);
      res.status(200).json(listings);
    } catch (error) {
      console.log(error.message);
    }
  } else {
    res.status(500).json({ message: "You can only access your listings" });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found "));
    }
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
