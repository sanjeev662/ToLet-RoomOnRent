const express = require("express");
const Place = require("../models/Place.js");

const Router = express.Router();


Router.get("/", async (req, res) => {
  const page = req.query.page || 1;
  const ITEM_PER_PAGE = req.query.size || 6;
  const { address, placetype } = req.query;

  try {
    const skip = (page - 1) * ITEM_PER_PAGE;

    const query = {
      ...(address && { address: { $regex: address, $options: "i" } }),
      ...(placetype && { placetype: { $regex: placetype, $options: "i" } })
    };

    const count = await Place.countDocuments(query);
    const placesdata = await Place.find(query).sort({ createdAt: -1 }).limit(ITEM_PER_PAGE).skip(skip);

    const pageCount = Math.ceil(count / ITEM_PER_PAGE);

    res.status(200).json({
      Pagination: {
        count,
        pageCount,
      },
      placesdata,
    });

  } catch (error) {
    res.status(500).json({ message: "Some errors occurred", success: false });
  }
});

//for getting all posted places detail
Router.get("/allplaces", async (req, res) => {
  try {
    const places = await Place.find();

    if (!places) {
      return res.status(404).json({ message: "places not found" });
    }
    res.send(places);
  } catch (error) {
    res.status(400).send("Error while getting the places. Try again later.");
  }
});

//for getting specific posted place detail by id
Router.get("/:id", async (req, res) => {
  try {
    const placeId = req.params.id;
    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ message: "place not found" });
    }
    res.send(place);
  } catch (error) {
    res.status(400).send("Error while getting the place. Try again later.");
  }
});


module.exports = Router;