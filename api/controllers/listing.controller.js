import { Listing } from "../models/lisitng.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  console.log("create listing function called");
  try {
    const listing = await Listing.create(req.body);
    return res.status(200).json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    return res.status(500).json({ error: "Error creating listing" });
  }
};

export const deleteListing = async (req, res, next) => {
  console.log(req.params.id);
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(404, "You can only delete your own listings"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("deleted successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
