import express from "express";
import {
  test,
  updateUser,
  delteUser,
  getUserListings,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, delteUser);
router.get("/listings/:id", verifyToken, getUserListings);

export default router;
