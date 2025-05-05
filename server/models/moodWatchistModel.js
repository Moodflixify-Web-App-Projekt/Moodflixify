const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    items: [{
        type: {type: String, enum: ['movie', 'series', 'song'], required: true},
        itemId: {type: mongoose.Schema.Types.ObjectId, required: true},
    }],
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Watchlist', watchlistSchema);