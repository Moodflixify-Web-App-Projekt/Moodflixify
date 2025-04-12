const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = 'mongodb://localhost:27017/moodflixify';
const client = new MongoClient(uri);

async function connectDB(){
    try{
        await client.connect();
        console.log('Connected!');
        return client.db('moodflixify');
    }
    catch(error){
        console.log('MongoDB connection error:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;