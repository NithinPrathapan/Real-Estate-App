import express from "express";
import { googleAuth, signin, signup } from "../controllers/auth.controller.js";
import { updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleAuth);

export default router;
