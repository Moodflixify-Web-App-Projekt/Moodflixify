const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: String,
    overview: String,
    release_date: Date,
    genre_ids: [Number],
    tmdb_id: {type: Number, unique: true},
});

module.exports = mogoose.model('Movie', movieSchema);