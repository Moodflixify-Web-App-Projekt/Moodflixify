require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');

const app = express();

// Connect to MongoDB
connectDB().then(() => {
    console.log('Initialising...');
}).catch(error => {
    console.error('Error while trying to connect to MongoDB', error);
    process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});