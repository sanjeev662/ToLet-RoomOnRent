const express = require("express");
const Router = express.Router();
const User = require("../models/User.js");
const Booking = require("../models/Booking.js");
const Place = require("../models/Place.js");

const fetchUser = require("../middleware/fetchUserFromToken");

////////////////////////////// api for my bookings started ////////////////////////////////////////////////
////////////////////////////// api for my bookings started ////////////////////////////////////////////////
////////////////////////////// api for my bookings started ////////////////////////////////////////////////

Router.post("/bookings", fetchUser, async (req, res) => {
  try {
    const userId = req.userId;
    const {
      place,
      placeowner,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
    } = req.body;

    const placeDoc = await Place.findOne({ _id : place });

    console.log(placeDoc);

    if (!placeDoc) {
      return res.status(404).json({ error: "Place not found." });
    }
    if (placeDoc.isbooked) {
      return res.status(400).json({ error: "Place is already booked." });
    }

    await Place.updateOne({ _id: placeDoc._id }, { $set: { isbooked: true } });

    const bookingDoc = await Booking.create({
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
      owner: placeowner,
      user: userId,
    });

    res.json(bookingDoc);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while booking. Try again later.");
  }
});



Router.delete("/cancelbooking/:id", fetchUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const bookings = await Booking.findById(id);
    if (!bookings) {
      return res.status(404).json({ message: "booking not found" });
    }

    const placeDoc = await Place.findOne( { _id: bookings.place } );
    if (!placeDoc) {
      return res.status(404).json({ message: "Place not found." });
    }
    if (!placeDoc.isbooked) {
      return res.status(400).json({ message: "Place is not booked." });
    }
    await Booking.findByIdAndDelete(id);

    await Place.updateOne({ _id: placeDoc._id }, { $set: { isbooked: false } });

    res.json({ success: true, message: "booking cancelled successfully" });
  } catch (error) {
    res.status(400).json(error);
  }
});


Router.get("/allbookings", fetchUser, async (req, res) => {
  try {
    const userId = req.userId;
    const booked = await Booking.find({ user: userId })
      .populate("place")
      .sort({ createdAt: -1 });
    res.send(booked);
  } catch (error) {
    res
      .status(400)
      .send("Error while getting the list of booked. Try again later.");
  }
});

////////////////////////////// api for my bookings ended ////////////////////////////////////////////////
////////////////////////////// api for my bookings ended ////////////////////////////////////////////////

////////////////////////////// api for saved (wishlist) start////////////////////////////////////////////
////////////////////////////// api for saved (wishlist) start////////////////////////////////////////////

Router.post("/addsaved/:id", fetchUser, async (req, res) => {
  try {
    const { id } = req.params;

    const saved = await Place.findOne({ _id: id });

    const Usercontact = await User.findOne({ _id: req.userId });

    const exists = Usercontact.saved.some((savedItem) => savedItem._id == id);
    if (exists) {
      return res
        .status(201)
        .json({ message: "Already added in wishlist", success: false });
    }

    if (Usercontact) {
      const savedData = await Usercontact.addsaveddata(saved);

      await Usercontact.save();
      res.status(201).json({ message: "Successfully added in wishlist", success: true });
    }
  } catch (error) {
    console.log(error);
  }
});

Router.delete("/removesaved/:id", fetchUser, async (req, res) => {
  try {
    const { id } = req.params;

    const userdata = await User.findOne({ _id: req.userId });

    userdata.saved = userdata.saved.filter((cruval) => {
      return cruval._id != id;
    });

    userdata.save();
    res.status(201).json(userdata);
  } catch (error) {
    console.log(error + "jwt provide then remove");
    res.status(400).json(error);
  }
});

Router.get("/savedplaces", fetchUser, async (req, res) => {
  const page = req.query.page || 1;
  const ITEM_PER_PAGE = req.query.size || 6;
  const { address, placetype } = req.query;

  try {
    const skip = (page - 1) * ITEM_PER_PAGE;

    const userdata = await User.findOne({ _id: req.userId });

    const query = {
      ...(address && { address: { $regex: address, $options: "i" } }),
      ...(placetype && { placetype: { $regex: placetype, $options: "i" } }),
    };

    const filterFunction = (item) => {
      for (const key in query) {
        if (query.hasOwnProperty(key)) {
          if (typeof query[key] === "object") {
            const regex = new RegExp(query[key].$regex, query[key].$options);
            if (!regex.test(item[key])) {
              return false;
            }
          } else {
            if (item[key] !== query[key]) {
              return false;
            }
          }
        }
      }
      return true;
    };

    const filteredDatas = userdata.saved.filter(filterFunction);

    const filteredDataIds = filteredDatas.map((item) => item._id);
    const filteredData = await Place.find({
      _id: { $in: filteredDataIds },
    }).sort({ createdAt: -1 });

    const count = filteredData.length;
    const saveddata = filteredData.slice(skip, skip + ITEM_PER_PAGE);

    const pageCount = Math.ceil(count / ITEM_PER_PAGE);
    res.status(200).json({
      Pagination: {
        count,
        pageCount,
      },
      saveddata,
    });
  } catch (error) {
    res.status(500).json({ message: "Some errors occurred", success: false });
  }
});

////////////////////////////// api for saved (wishlist) ended////////////////////////////////////////////
////////////////////////////// api for saved (wishlist) ended////////////////////////////////////////////
////////////////////////////// api for saved (wishlist) ended////////////////////////////////////////////

module.exports = Router;
