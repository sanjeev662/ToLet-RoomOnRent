const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
    {           
    "user_name": { type: String, default: "" },
    "user_rating": { type: String, default: "" },
    "user_image":{ type: String, default: "" },
    "user_testimonial": { type: String, default: "" }
    },
    { timestamps: true }
);

const Testimonial = new mongoose.model("Testimonial", TestimonialSchema);

module.exports = Testimonial;

