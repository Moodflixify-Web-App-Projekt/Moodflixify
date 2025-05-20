const mongoose = require('mongoose');
const User = require('../models/userModel');
const connectDB = require('../config/db');

const seedDB = async () => {

    try {
        await connectDB();
        await User.deleteMany({});

        const testUser = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

       // await User.save(testUser);
        await testUser.save();

        console.log('Database connected');
        process.exit(0);
    }
    catch(error){
        console.error('Error while trying to connect to MongoDB', error);
        process.exit(1);
    }

};

seedDB().then(() => {
    console.log('Database connected');
}).catch(error => {
    console.error('Error while trying to connect to MongoDB', error);
    process.exit(1);
});