const express = require("express");
const Router = express.Router();
const Testimonial = require("../models/Testimonial");
const fetchUser = require('../middleware/fetchUserFromToken');

//for getting all testimonial data
Router.get("/", async (req, res) => {
  try {
    const testimonial = await Testimonial.find({});
    res.status(200).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Some error occured", success: false, });
  }
});

//for check only
Router.post("/testimonialcreate", fetchUser, async (req, res) => {
  const { user_name, user_rating, user_image, user_testimonial } = req.body;
  try {
    const testimonials = new Testimonial({
      user_name,
      user_rating,
      user_image,
      user_testimonial,
    });
    await testimonials.save();
    return res.status(201).json(testimonials);
  } catch (error) {
    return res.status(500).json({ message: "Some error occurred", success: false });
  }
});

module.exports = Router;
