const express = require("express");
const Router = express.Router();
const Testimonial = require("../models/Testimonial");

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
Router.post("/testimonialcreate", async (req, res) => {
  const { user_name, user_rating, user_image, user_testimonial } = req.body;

  const testimonials = new Testimonial({
    user_name,
    user_rating,
    user_image,
    user_testimonial,
  });
  const storedata = await testimonials.save();
  
  return res.status(201).json(testimonials);
});

module.exports = Router;
