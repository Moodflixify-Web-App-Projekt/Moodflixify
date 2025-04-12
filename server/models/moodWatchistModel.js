const mongoose = require('mongoose');

const moodWatchlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String, required: true, enum: ['Happy', 'Sad', 'Normal', 'Stressed', 'Relaxed', 'Angry'] },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    series: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Series' }],
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
});

module.exports = mongoose.model('MoodWatchlist', moodWatchlistSchema);