import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("token verification middleware");
  const token = req.cookies.access_token;
  if (!token) {
    console.log("no token provided");
    return next(
      errorHandler(401, "Unauthorized access!!! Please signin again.")
    );
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    console.log("verifyToken user", user);

    if (err) {
      console.log("verifyToken error", err);
      return next(errorHandler(403, "Authentication error please try again"));
    }

    req.user = user; // Sending the user from this section
    next();
  });
};
