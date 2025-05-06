require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');

const app = express();

connectDB().then(() => {
    console.log('Connected to DB');
}).catch((error) => {
    console.error('Error connecting to DB', error);
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));