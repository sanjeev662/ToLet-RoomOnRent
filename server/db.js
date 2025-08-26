require('dotenv').config()
const mongoose = require('mongoose');
const mongoURI = process.env.mongoURI;

const connectToMongo = async ()=>{
    try {
        await mongoose.connect(String(mongoURI));
        console.log("connected to mongo");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}



module.exports = connectToMongo;