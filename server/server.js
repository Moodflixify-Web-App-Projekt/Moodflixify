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
app.use(cors({
    origin: 'https://moodflixify.netlify.app/' || 'http://localhost:5173/',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders:['Content-type', 'Authorization']
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Moodflixify API',
        endpoints: {
            auth: '/api/auth (register, login, profile)',
            mood: '/api/mood (recommendations, watchlist)',
        },
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});