const express = require("express");
const multer = require("multer");
const User = require("../models/User.js");
const Place = require("../models/Place.js");
const Booking = require("../models/Booking.js");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fetchUser = require("../middleware/fetchUserFromToken");

const Router = express.Router();

Router.post("/upload-by-link", async (req, res) => {
  try {
    const { link } = req.body;
    const newName = "photo" + Date.now();
    const result = await cloudinary.uploader.upload(link, {
      public_id: newName,
      resource_type: "image",
      folder: "to-let-images",
    });

    res.json(result.secure_url);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image." });
  }
});

// const photosMiddleware = multer({
//   // dest: "/to-let-images",
//   limits: { fileSize: 1024 * 1024 * 10 },
// });

const photosMiddleware = multer({
  dest: path.join(__dirname, 'to-let-images'),
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB file size limit
});

// Middleware for image upload using multer
Router.post(
  "/upload-by-file",
  photosMiddleware.array("photos", 100),
  async (req, res) => {
    try {
      const uploadedFiles = [];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const result = await cloudinary.uploader.upload(file.path, {
          public_id: file.originalname,
          resource_type: "image",
          folder: "to-let-images",
        });

        uploadedFiles.push(result.secure_url);
      }

      res.json(uploadedFiles);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload images." });
    }
  }
);

// Middleware for creating a post
Router.post("/upload", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const {
      title,
      address,
      placetype,
      addedPhotos,
      description,
      price,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      latitude,
      longitude,
    } = req.body;

    const place = new Place({
      title,
      address,
      placetype,
      photos: addedPhotos,
      description,
      price,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      latitude,
      longitude,
      owner: user._id,
      ownername: user.firstName,
    });

    await place.save();

    res.send("place uploaded successfully.");
  } catch (error) {
    res.status(400).send("Error while uploading place. Try again later.");
  }
});

Router.delete("/deleteplace/:id", async (req, res) => {
  try {
    const placeId = req.params.id;
    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ message: "place not found" });
    }

    // Delete photos from Cloudinary
    const imagePaths = place.photos;
    for (const imagePath of imagePaths) {
      await cloudinary.uploader.destroy(imagePath);
    }

    // Delete the place from the database
    await Place.findByIdAndDelete(placeId);

    res.json({ success: true, message: "place deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete place" });
  }
});

//update place by id
Router.put("/update", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const {
      id,
      title,
      address,
      placetype,
      addedPhotos,
      description,
      price,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      latitude,
      longitude,
    } = req.body;

    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({ message: "place not found" });
    }

    (place.id = id),
      (place.title = title),
      (place.address = address),
      (place.placetype = placetype),
      (place.photos = addedPhotos),
      (place.description = description),
      (place.price = price),
      (place.perks = perks),
      (place.extraInfo = extraInfo),
      (place.checkIn = checkIn),
      (place.checkOut = checkOut),
      (place.maxGuests = maxGuests),
      (place.latitude = latitude),
      (place.longitude = longitude),
      (place.owner = user._id),
      (place.ownername = user.firstName),
      await place.save();

    res.send(place);
  } catch (error) {
    res.status(400).send("Error while updating the place. Try again later.");
  }
});

//for getting loggedIn user places at a time
Router.get("/user-places", fetchUser, async (req, res) => {
  try {
    const userId = req.userId;
    const places = await Place.find({ owner: userId }).sort({ createdAt: -1 });
    res.send(places);
  } catch (error) {
    res
      .status(400)
      .send("Error while getting the list of places. Try again later.");
  }
});

//for getting loggedIn user bookedhosting at a time
Router.get("/bookedhosting", fetchUser, async (req, res) => {
  try {
    const userId = req.userId;
    const bookedhostings = await Booking.find({ owner: userId })
      .populate("place")
      .sort({ createdAt: -1 });
    res.send(bookedhostings);
  } catch (error) {
    res
      .status(400)
      .send("Error while getting the list of places. Try again later.");
  }
});

Router.delete("/cancelbookedhosting/:id", fetchUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const bookings = await Booking.findById(id);
    if (!bookings) {
      return res.status(404).json({ message: "bookedhosting not found" });
    }

    const placeDoc = await Place.findOne({ place: bookings.place });

    if (!placeDoc) {
      return res.status(404).json({ error: "Place not found." });
    }
    if (!placeDoc.isbooked) {
      return res.status(400).json({ error: "Place is not booked." });
    }
    await Booking.findByIdAndDelete(id);

    await Place.updateOne({ _id: placeDoc._id }, { $set: { isbooked: false } });
    res.json({
      success: true,
      message: "bookedhosting cancelled successfully",
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = Router;

// // for deleting place by id
// Router.delete("/delete/:id", async (req, res) => {
//   try {
//     const placeId = req.params.id;
//     const place = await place.findById(placeId);

//     if (!place) {
//       return res.status(404).json({ message: "place not found" });
//     }

//     const imagePath = place.img_path;
//     await cloudinary.uploader.destroy(imagePath);
//     await place.findByIdAndDelete(placeId);

//     res.json({ success: true, message: "place deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete place" });
//   }
// });
