//const express = require('express');
//const app = express();
//const PORT = process.env.PORT || 5000;

//app.get('/', (req, res) => {
    //res.send("Hello from the backend!");
//});

//app.listen(PORT, () => {
    //console.log(`Server is running on port: ${PORT}`);
//});

const express = require("express");
const connectDB = require("./config/db");
require('dotenv').config({ path: "./.env"});

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Moodflixify Server is running!");
});

async function startServer(){
    try{
        await connectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    }
    catch(error){
        console.error("Server failed to start", error);
        process.exit(1);
    }
}

startServer().catch(error => {
    console.error("Failed to start server", error);
    process.exit(1);
});