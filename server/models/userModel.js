const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Watchlist' },
});

module.exports = mongoose.model('User', userSchema);