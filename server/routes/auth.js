require('dotenv').config()
const express = require('express');
const Router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken') // generates a token to identify user,sort of cookie 
const JWT_SECRET = process.env.JWT_SECRET; // for signing web token
const fetchUser = require('../middleware/fetchUserFromToken')
const PassValidator = require('../models/Forgotpass')
var nodemailer = require('nodemailer');
const Mailer = require('./Mailer')


// creating a user using: post "/api/auth"  login is not required by user
Router.post('/signup/email/verify', [
    body('email', 'Enter a valid email address').isEmail(),
    body('password', 'Password cannot be blank').exists(),
    body('password', 'Enter a valid password of minimum 8 digits').isLength({ min: 8 }),
    body('phone', 'Enter a valid phone no of minimum 10 digits').isLength({ min: 10, max: 10 }),
    body('fname', 'Enter a valid fist name of minimum 3 digits').isLength({ min: 3 }),
    body('lname', 'Enter a valid last name of minimum 3 digits').isLength({ min: 3 }),
    body('authcode', 'Enter 6 digit verification code send to your email').isLength({ min: 6 }),
],
    // if there is validation problem
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array() });
        }

        // To check wheather the user exists already with the given email
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success: false, message: "User with given email id already exist. Please Login" })
        }

        try {

            let storeAuthCode = await PassValidator.findOne({ email: req.body.email });

            if (!storeAuthCode) {
                return res.status(400).json({ message: 'No such user with this email requested to create a new account', success: false });
            }

            if (storeAuthCode.authcode !== req.body.authcode) {
                return res.status(400).json({ message: 'Wrong Verification code', success: false });
            }

            if (storeAuthCode.authcode === req.body.authcode) {
                try {
                    bcrypt.genSalt(10, async (error, salt) => {
                        bcrypt.hash(req.body.password, salt, async (error, hashedPassword) => {

                            // Store hash in your DB and to Creates a new user
                            try {
                                let fullname=req.body.fname+" "+req.body.lname;
                                let user = await User.create({
                                    firstName: req.body.fname,
                                    lastName: req.body.lname,
                                    email: req.body.email,
                                    username: fullname,
                                    phone: req.body.phone,
                                    password: hashedPassword,
                                })

                                // to generation a token or a cookie to identify the user 
                                const data = {
                                    user: {
                                        user: user.id // id is obtained form mongoose
                                    }
                                }

                                // console.log(data);
                                const authToken = jwt.sign(data, JWT_SECRET)
                                // console.log(authToken);

                                const msg = `Dear ${req.body.fname + " " + req.body.lname},<br><br>
                                Congratulations on taking the first step towards getting dream stays!  Get ready to embark on a seamless journey towards your dream . Our team support you throughout your journey.<br> 
                                Thank you for choosing us.<br><br>
                                Best regards,<br> Sanjeev Singh`

                                const sub = 'Welcome to TO-LET site!';

                                Mailer(req.body.email, sub, msg);

                                // console.log('success', success);

                                const success = true;
                                res.status(200).json({ success, authToken, message: 'verified' });
                            }

                            catch (error) {
                                console.error(error.message);
                                res.status(500).json({ message: "Some error occured", success: false, });
                            }

                        });
                    });
                } catch (error) {
                    console.error(error.message);
                    res.status(500).json({ message: "Some error occured", success: false, });
                }
            }
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ message: "Some error occured", success: false, });
        }
    }
)

Router.post('/signup/email', [
    body('email', 'Enter a valid email address').isEmail(),
],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array() });
        }

        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success: false, "error": "User with given email id already exist." })
        }

        // sending otp for verification of email
        try {
            const trashCode = await PassValidator.findOneAndDelete({ email: req.body.email })
            // console.log(trashCode);


            const authCode = Math.floor(100000 + Math.random() * 900000);
            authCodeCheck = authCode;

            const msg = `Thank you for choosing our site to-let. Use the OTP below to verify your account.<br>
            [${authCode}]<br>
            If you are facing issues signing up, please don't hesitate to reach out to our support team.<br><br>
            Best regards,  <br>Sanjeev Singh`;

            let mailSent = await Mailer(req.body.email, 'Your comfortable stays on way!', msg);
            console.log(mailSent)

            if (mailSent) {
                try {
                    let storeAuthCode = await PassValidator.create({
                        email: req.body.email,
                        authcode: authCode,
                    })
                    res.json({ success: true, message: "Email Send" })
                }

                catch (error) {
                    console.log("here1")
                    console.error(error.message);
                    res.status(500).json({ message: "Some error occured", success: false, });
                }
            }
            else {
                console.log("here")
                res.status(500).json({ message: "Some error occured", success: false, });
            }
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ message: "Some error occured", success: false, });
        }

    })

// to authenticate a user while the user login  login is not required by user
Router.post('/signin', [
    body('email', 'Enter a valid email address').isEmail(),
    body('password', 'Password cannot be blank').exists(),
    body('password', 'Enter a valid password of minimum 8 digits').isLength({ min: 8 }),

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

        // To compare hashed password
        bcrypt.compare(req.body.password, user.password, async (error, compareResult) => {
            if (compareResult === false) {
                const success = false;
                return res.status(400).json({ success: false, message: "Invalid email or password" });
            }

            const paylord = {
                user: {
                    user: user.id
                }
            }
            const authToken = await jwt.sign(paylord, JWT_SECRET)

            await res.json({ success: true, authToken,
                _id:user._id,
                username:user.username,
                email:user.email,
                pic : user.pic, 
                message: 'verified' });
        });

    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Some error occured", success: false, });
    }
}
)


// Route -3 Obtaining details from jws token or decrypting token  login is required by user
Router.post('/verifyuser', fetchUser, async (req, res) => {
    try {
        const userId = req.userId;
        const userWithId = await User.findById(userId).select('firstName lastName email');
        if (!userWithId) {
            return res.status(401).send({ message: "Please authenticate using a valid token", success: false })
        }
        else {
            res.send({ success: true, message: 'verified' , data : userWithId });
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Some error occured", success: false, });
    }
})


module.exports = Router


Router.post('/delete/email', [
    body('email', 'Enter a valid email address').isEmail(),
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array() });
        }

        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ success: false, message: "No User with given email id exists." })
        }

        // sending otp for verification of email
        try {
            const trashCode = await PassValidator.findOneAndDelete({ email: req.body.email })

            const authCode = Math.floor(100000 + Math.random() * 900000);
            authCodeCheck = authCode;

            if (await Mailer(req.body.email, 'Verification Code For *ACCOUNT DELETION*', String('Your verification code is ' + authCode))) {

                try {
                    let storeAuthCode = await PassValidator.create({
                        email: req.body.email,
                        authcode: authCode,
                    })

                    res.json({ success: true, message: "Email Send" })
                }

                catch (error) {
                    console.error(error.message);
                    res.status(500).json({ message: "Some error occured", success: false, });
                }
            }
            else {
                res.status(500).json({ message: "Some error occured", success: false, });
            }

        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ message: "Some error occured", success: false, });
        }

    })


Router.post('/delete/email/verify', [
    body('email', 'Enter a valid email address').isEmail(),
    body('password', 'Password cannot be blank').exists(),
    body('password', 'Enter a valid password of minimum 8 digits').isLength({ min: 8 }),
    body('authcode', 'Enter 6 digit verification code send to your email').isLength({ min: 6 })
],
    // if there is validation problem
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array() });
        }

        // To check wheather the user exists already with the given email
        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ success: false, "error": "No user with given email id exists." })
        }


        try {

            let storeAuthCode = await PassValidator.findOne({ email: req.body.email });


            if (!storeAuthCode) {
                return res.status(400).json({ message: 'No such user with this email requested to delete a new account', success: false });
            }

            if (storeAuthCode.authcode !== req.body.authcode) {
                return res.status(400).json({ message: 'Invalid Verification code', success: false });
            }


            if (storeAuthCode.authcode === req.body.authcode) {
                try {

                    bcrypt.compare(req.body.password, user.password, async (error, compareResult) => {
                        if (compareResult === false) {
                            return res.status(400).json({ success: false, message: "Invalid email or password" });
                        }

                        await User.deleteOne({ email: req.body.email })

                        const dateNI = new Date();
                        var ISToffSet = 330; //IST is 5:30; i.e. 60*5+30 = 330 in minutes 
                        offset = ISToffSet * 60 * 1000;
                        var date = new Date(dateNI.getTime() + offset);

                        const dnt = date.getDate() + '-' + date.getMonth() + 1 + '-' + date.getFullYear() + ' at ' + date.getHours() + ':' + date.getMinutes();
                        const sub = 'New Login Activity'

                        const msg = `Hi ${user.name},<br><br>Account deleted on${dnt}.<br><br>Regards<br>Authify`

                        Mailer(req.body.email, sub, msg);

                        await res.json({ success: true, message: "Account deleted successfully" });
                    });
                } catch (error) {
                    console.error(error.message);
                    res.status(500).json({ message: "Some error occured", success: false, });
                }
            }
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ message: "Some error occured", success: false, });
        }
    }
)

