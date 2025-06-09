const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: String,
    overview: String,
    release_date: String, // Changed from Date to String
    genre_ids: [Number],
    tmdb_id: {type: String, unique: true}, // Changed from Number to String, TMDb IDs can be large
    poster_path: String, // Added to store poster path
    director: String,
});

module.exports = mongoose.model('Movie', movieSchema);