const express = require ('express');
const router = express.Router();
const {getRecommendations, addToWatchlist, getWatchlist} = require('../controllers/moodController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('recommendations', authMiddleware, getRecommendations);
router.post('/watchlist', authMiddleware, addToWatchlist);
router.get('/watchlist', authMiddleware, getWatchlist);

module.exports = router;