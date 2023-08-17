require('dotenv').config()
const jwt = require('jsonwebtoken');


//Get the user from the jwt token add add id to the req object 
const fetchUser = async (req, res, next) => {


    // bringing token from user
    const token = req.header('token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" })
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET) //will decode the token
        req.userId = data.user.user;
        next()
    }

    catch (error) {
        res.status(401).send({ message: "Please authenticate using a valid token" })
    }
    
}

module.exports = fetchUser;
