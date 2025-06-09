const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    name: String,
    artists: [String], // Ensure this is explicitly an array of strings
    album: String,
    spotify_id: { type: String, unique: true },
    duration_ms: Number,
    album_image_url: String, // Added to store album image URL
});

module.exports = mongoose.model('Song', songSchema);