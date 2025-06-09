const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
    name: String,
    overview: String,
    first_air_date: String, // Changed from Date to String
    genre_ids: [Number],
    tmdb_id: { type: String, unique: true }, // Changed from Number to String
    poster_path: String, // Added to store poster path
    director: String,
});

module.exports = mongoose.model('Series', seriesSchema);