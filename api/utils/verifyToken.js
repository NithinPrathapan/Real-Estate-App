import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler, (401, "Unauthorized"));
  }
  jwt.verify(token, process.env.SECRET, (err, user) => {
    console.log("verifyToken user", user);
    if (err) {
      console.log("verifyToken error", err);
      return next(errorHandler, (403, "forbidden"));
    }
    req.user = user; //sending the user from this section
    next();
  });
};
