import express from "express";
import {
  googleAuth,
  signin,
  signup,
  signout,
} from "../controllers/auth.controller.js";
import { updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleAuth);
router.get("/signout", signout);

export default router;
