const mongoose = require("mongoose");
require('dotenv').config({path: "./.env"});

async function connectDB(){
    const MONGO_URI = process.env.MONGO_URI;
    if(!MONGO_URI){
        throw new Error("MongoDB URI is missing or not defined in .env file");
    }
    try{
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected");
        return mongoose.connection;
    }
    catch(error){
        console.error("MongoDB connection error", error);
        throw error;
    }
}

module.exports = connectDB;