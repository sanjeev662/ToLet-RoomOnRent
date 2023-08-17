require("dotenv").config();
const express = require("express");
const Router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // generates a token to identify user,sort of cookie
const JWT_SECRET = process.env.JWT_SECRET; // for signing web token
const fetchUser = require("../middleware/fetchUserFromToken");
const PassValidator = require("../models/Forgotpass");
var nodemailer = require("nodemailer");
const Mailer = require("./Mailer");

Router.post(
  "/google/signup",
  [
    body("googleId", "Enter a valid googleID of minimum 20 digits").isLength({
      min: 20,
    }),
    body("email", "Enter a valid email address").isEmail(),
    body("phone", "Enter a valid phone no of minimum 10 digits").isLength({
      min: 10,
    }),
    body("fname", "Enter a valid fist name of minimum 3 digits").isLength({
      min: 3,
    }),
    body("lname", "Enter a valid last name of minimum 3 digits").isLength({
      min: 3,
    }),
  ],
  // if there is validation problem
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }

    // To check wheather the user exists already with the given email
    let user1 = await User.findOne({ email: req.body.email });
    if (user1) {
      return res.status(400).json({
        success: false,
        message: "User with given email id already exist. Please Login",
      });
    }

    try {
      // Store hash in your DB and to Creates a new user
      let fullname = req.body.fname + " " + req.body.lname;
      let user = await User.create({
        firstName: req.body.fname,
        lastName: req.body.lname,
        email: req.body.email,
        username: fullname,
        phone: req.body.phone,
        password: null,
        googleId: Number(req.body.googleId),
      });

      // to generation a token or a cookie to identify the user
      const data = {
        user: {
          user: user.id, // id is obtained form mongoose
        },
      };

      // console.log(data);
      const authToken = jwt.sign(data, JWT_SECRET);
      // console.log(authToken);
      const msg = `Dear ${req.body.fname + " " + req.body.lname},<br><br>
                                Congratulations on taking the first step towards getting dream stays!  Get ready to embark on a seamless journey towards your dream . Our team support you throughout your journey.<br> 
                                Thank you for choosing us.<br><br>
                                Best regards,<br> Sanjeev Singh`;

      const sub = "Welcome to TO-LET site!";

      Mailer(req.body.email, sub, msg);

      // console.log('success', success);

      const success = true;
      res.status(200).json({ success, authToken, message: "verified" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Some error occured", success: false });
    }
  }
);

Router.post(
  "/google/signin",
  [
    body("googleId", "Enter a valid googleID of minimum 20 digits").isLength({
      min: 20,
    }),
  ],
  // if there is validation problem
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }

    // To check wheather the user exists already with the given email
    let user = await User.findOne({ googleId: req.body.googleId });
    if (!user) {
      return res.status(200).json({ success: false, requireSignup: true });
    }

    try {
      const paylord = {
        user: {
          user: user.id,
        },
      };

      const authToken = await jwt.sign(paylord, JWT_SECRET);

      await res.json({
        success: true,
        authToken,
        _id: user._id,
        username: user.username,
        email: user.email,
        pic: user.pic,
        message: "verified",
        requireSignup: false,
      });
    } catch (error) {
      res.status(500).json({ message: "Some error occured", success: false });
    }
  }
);

Router.post(
  "/facebook/signup",
  [
    body("facebookId", "Enter a valid facebookID of minimum 5 digits").isLength(
      { min: 5 }
    ),
    body("phone", "Enter a valid phone no of minimum 10 digits").isLength({
      min: 10,
    }),
    body("fname", "Enter a valid fist name of minimum 3 digits").isLength({
      min: 3,
    }),
    body("lname", "Enter a valid last name of minimum 3 digits").isLength({
      min: 3,
    }),
  ],
  // if there is validation problem
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }

    // To check wheather the user exists already with the given email
    let user1 = await User.findOne({ email: req.body.email });
    if (user1) {
      return res.status(400).json({
        success: false,
        message: "User with given email id already exist. Please Login",
      });
    }

    try {
      // Store hash in your DB and to Creates a new user
      let fullname = req.body.fname + " " + req.body.lname;
      let user = await User.create({
        firstName: req.body.fname,
        lastName: req.body.lname,
        email: req.body.email,
        username: fullname,
        phone: req.body.phone,
        password: null,
        facebookId: Number(req.body.facebookId),
      });

      // to generation a token or a cookie to identify the user
      const data = {
        user: {
          user: user.id, // id is obtained form mongoose
        },
      };

      // console.log(data);
      const authToken = jwt.sign(data, JWT_SECRET);

      const sub = "Welcome to To-Let Platform!";

      Mailer(req.body.email, sub, msg);

      // // console.log('success', success);

      const success = true;
      res.status(200).json({ success, authToken, message: "verified" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Some error occured", success: false });
    }
  }
);

Router.post(
  "/facebook/signin",
  [
    body(
      "facebookId",
      "Enter a valid facebookID of minimum 10 digits"
    ).isLength({ min: 5 }),
  ],
  // if there is validation problem
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }

    // To check wheather the user exists already with the given email
    let user = await User.findOne({ facebookId: req.body.facebookId });
    if (!user) {
      return res.status(200).json({ success: false, requireSignup: true });
    }

    try {
      const paylord = {
        user: {
          user: user.id,
        },
      };

      const authToken = await jwt.sign(paylord, JWT_SECRET);

      await res.json({
        success: true,
        authToken,
        _id: user._id,
        username: user.username,
        email: user.email,
        pic: user.pic,
        message: "verified",
        requireSignup: false,
      });
    } catch (error) {
      res.status(500).json({ message: "Some error occured", success: false });
    }
  }
);

module.exports = Router;
