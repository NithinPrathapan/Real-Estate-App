import express from "express";
import {
  createListing,
  deleteListing,
  editListing,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/edit/:id", verifyToken, editListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);

export default router;
