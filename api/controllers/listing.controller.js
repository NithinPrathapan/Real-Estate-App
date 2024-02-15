import mongoose from "mongoose";
import Listing from "../models/lisitng.model.js";
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

export const editListing = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("Invalid ObjectId:", req.params.id);
      return next(errorHandler(400, "Invalid ObjectId"));
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      console.log("Listing not found for ID:", req.params.id);
      return next(errorHandler(404, "Listing not found"));
    }

    if (req.user.id !== listing.userRef) {
      console.log("User is not authorized to edit this listing");
      return next(errorHandler(404, "You can only edit your own listings"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    console.log("Listing updated successfully:", updatedListing);
    res.status(200).json(updatedListing);
  } catch (error) {
    console.error("Error in editListing:", error);
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  console.log(req.params.id);
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(402, "listing not found"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
export const getListings = async (req, res, next) => {
  console.log("function called");
  try {
    let limit = parseInt(req.query.limit) || 9;
    let startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    let searchTerm = req.query.searchTerm || "";
    let sort = req.query.sort || "createdAt";
    let order = req.query.order || "desc";

    let listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(startIndex);
    res.status(200).json(listings);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
