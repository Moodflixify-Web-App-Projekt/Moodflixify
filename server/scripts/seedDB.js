const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Movie = require('../models/movie');
const Series = require('../models/series');
const Song = require('../models/song');
const User = require('../models/userModel');
const MoodWatchlist = require('../models/moodWatchistModel');

async function seedDB() {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log('Starting database seeding...');

        // Clear existing data
        console.log('Clearing existing data...');
        await Movie.deleteMany({}).catch((err) => {
            console.error('Error clearing Movies:', err.message);
            throw err;
        });
        await Series.deleteMany({}).catch((err) => {
            console.error('Error clearing Series:', err.message);
            throw err;
        });
        await Song.deleteMany({}).catch((err) => {
            console.error('Error clearing Songs:', err.message);
            throw err;
        });
        await User.deleteMany({}).catch((err) => {
            console.error('Error clearing Users:', err.message);
            throw err;
        });
        await MoodWatchlist.deleteMany({}).catch((err) => {
            console.error('Error clearing MoodWatchlists:', err.message);
            throw err;
        });
        console.log('Cleared existing data');

        // Insert Movies
        console.log('Inserting movies...');
        const movies = await Movie.insertMany([
            { name: 'The Shawshank Redemption', year: 1994, director: 'Frank Darabont', mood: 'Happy' },
            { name: 'Inception', year: 2010, director: 'Christopher Nolan', mood: 'Normal' }, // Changed 'Excited' to 'Normal'
            { name: 'The Pursuit of Happyness', year: 2006, director: 'Gabriele Muccino', mood: 'Sad' },
            { name: 'Amélie', year: 2001, director: 'Jean-Pierre Jeunet', mood: 'Relaxed' },
            { name: 'Mad Max: Fury Road', year: 2015, director: 'George Miller', mood: 'Angry' },
        ]).catch((err) => {
            console.error('Error inserting Movies:', err.message);
            throw err;
        });
        console.log(`Inserted ${movies.length} movies`);

        // Insert Series
        console.log('Inserting series...');
        const series = await Series.insertMany([
            { name: 'Friends', year: 1994, director: 'David Crane', mood: 'Happy' },
            { name: 'Breaking Bad', year: 2008, director: 'Vince Gilligan', mood: 'Stressed' }, // Changed 'Excited' to 'Stressed'
            { name: 'This Is Us', year: 2016, director: 'Dan Fogelman', mood: 'Sad' },
            { name: 'The Office', year: 2005, director: 'Greg Daniels', mood: 'Relaxed' },
            { name: 'Fargo', year: 2014, director: 'Noah Hawley', mood: 'Angry' },
        ]).catch((err) => {
            console.error('Error inserting Series:', err.message);
            throw err;
        });
        console.log(`Inserted ${series.length} series`);

        // Insert Songs
        console.log('Inserting songs...');
        const songs = await Song.insertMany([
            { name: 'Happy', album: 'G I R L', artist: 'Pharrell Williams', year: 2013, mood: 'Happy' },
            { name: 'Sweet Child O\' Mine', album: 'Appetite for Destruction', artist: 'Guns N\' Roses', year: 1987, mood: 'Normal' },
            { name: 'Hurt', album: 'The Downward Spiral', artist: 'Nine Inch Nails', year: 1994, mood: 'Sad' },
            { name: 'No Woman, No Cry', album: 'Natty Dread', artist: 'Bob Marley', year: 1974, mood: 'Relaxed' },
            { name: 'Killing in the Name', album: 'Rage Against the Machine', artist: 'Rage Against the Machine', year: 1992, mood: 'Angry' },
        ]).catch((err) => {
            console.error('Error inserting Songs:', err.message);
            throw err;
        });
        console.log(`Inserted ${songs.length} songs`);

        console.log('Inserting users...');
        const users = await User.insertMany([
            { email: 'alice@example.com', password: 'password123', name: 'Alice' },
            { email: 'bob@example.com', password: 'password456', name: 'Bob' },
        ]).catch((err) => {
            console.error('Error inserting Users:', err.message);
            throw err;
        });
        console.log(`Inserted ${users.length} users`);

        console.log('Inserting mood watchlists...');
        const watchlists = await MoodWatchlist.insertMany([
            {
                userId: users[0]._id,
                mood: 'Happy',
                movies: [movies[0]._id],
                series: [series[0]._id],
                songs: [songs[0]._id],
            },
            {
                userId: users[1]._id,
                mood: 'Sad',
                movies: [movies[2]._id],
                series: [series[2]._id],
                songs: [songs[2]._id],
            },
        ]).catch((error) => {
            console.error('Error inserting MoodWatchlists:', error.message);
            throw error;
        });
        console.log(`Inserted ${watchlists.length} mood watchlists`);

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Seeding failed:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

seedDB().catch((error) => {
    console.error('SeedDB execution failed:', error.message);
    process.exit(1);
});