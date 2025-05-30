const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected');
    } catch (error) {
        console.error('Error while trying to connect to MongoDB', error);
        process.exit(1);
    }
};

module.exports = connectDB;

//ConfigureDB connection