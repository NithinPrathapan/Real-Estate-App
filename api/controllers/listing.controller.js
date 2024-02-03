import { Listing } from "../models/lisitng.model.js";

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
