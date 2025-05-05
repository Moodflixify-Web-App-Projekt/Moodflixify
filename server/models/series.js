const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
    name: String,
    overview: String,
    first_air_date: Date,
    genre_ids: [Number],
    tmdb_id: { type: Number, unique: true },
});

module.exports = mongoose.model('Series', seriesSchema);