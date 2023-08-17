require('dotenv').config()
var nodemailer = require('nodemailer');
const express = require('express');
const Router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const PassValidator = require('../models/Forgotpass')
const bcrypt = require('bcryptjs');
const Mailer = require('./Mailer')

let authCodeCheck;

Router.post('/', [
    body('email', 'Enter a valid email address').isEmail(),
], async (req, res) => {

    // to that entered email and password are valid , thay can be misleading or incorrect
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array() });
    }

    // if user exists
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User with given email id does not exist." });

        }
        const trashCode = await PassValidator.findOneAndDelete({ email: req.body.email })
        // console.log(trashCode);

        const authCode = Math.floor(100000 + Math.random() * 900000);
        authCodeCheck = authCode;

        const msg = `Oops, seems like you forgot your password. No worries, Use the OTP below to reset your password and get back on track.<br>
        [${authCode}]<br>
        If you are still facing issues signing in/accessing your account, please don't hesitate to reach out to our support team.<br><br>
        Best regards, <br> Sanjeev Singh`;

        if (await Mailer(req.body.email, "Dont Worry, We've Got You Covered!", msg)) {
            try {
                let storeAuthCode = PassValidator.create({
                    email: req.body.email,
                    authcode: authCode,
                })
                res.json({ success: true, message: "Email Send" })
            }

            catch (error) {
                console.error(error.message);
                res.status(500).json({ message: "Some error occured", success: false });
            }
        }
        else {
            res.status(500).json({ message: "Some error occured", success: false });
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Some error occured", success: false });
    }
})


Router.post('/verify', [
    body('authcode', 'Enter a valid verification code of 6 digits').isLength({ min: 6 }),
    body('password', 'Enter a valid password of minimum 8 digits').isLength({ min: 8 }),

], async (req, res) => {

    // to that entered email and password are valid , thay can be misleading or incorrect
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array() });
    }

    // if user exists
    try {

        let storeAuthCode = await PassValidator.findOne({ email: req.body.email });
        // console.log(storeAuthCode);
        // const emailTochangePass = storeAuthCode.authcode;
        // console.log(emailTochangePass);

        if (!storeAuthCode) {
            return res.status(400).json({ success: false, message: 'No such user with this email requested to reset password' });
        }

        try {
            if (storeAuthCode.authcode === req.body.authcode) {

                bcrypt.genSalt(10, async (error, salt) => {
                    bcrypt.hash(req.body.password, salt, async (error, hashedPassword) => {
                        try {
                            const sub = 'Your Password has been Successfully Reset!'
                            const msg = `Success! Your password has been reset. You can now log in and continue your journey with us.<br>`

                            Mailer(req.body.email, sub, msg);

                            await User.updateOne({ email: req.body.email }, { password: hashedPassword })
                            res.json({ success: true, message: 'verified' })
                            await PassValidator.deleteOne({ email: req.body.email });
                        }

                        catch (error) {
                            console.error(error.message);
                            res.status(500).json({ message: "Some error occured", success: false, });
                        }
                    });
                });
            }

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: "Some error occured", success: false, });
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Some error occured", success: false, });
    }
})

module.exports = Router



























