const express = require ('express');
const router = express.Router();
const {getRecommendations, addToWatchlist, getWatchlist, removeFromWatchlist, emptyWatchlist, removeItemFromAnyWatchlist, emptyAllWatchlists, getAllWatchlistItems, universalRemoveFromWatchlist} = require('../controllers/moodController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/recommendations', authMiddleware, getRecommendations);
router.post('/watchlist', authMiddleware, addToWatchlist);
router.get('/watchlist', authMiddleware, getWatchlist);
router.delete('/watchlist/remove', authMiddleware, removeFromWatchlist);
router.delete('/watchlist/empty', authMiddleware, emptyWatchlist);
router.delete('/watchlist/remove-any', authMiddleware, removeItemFromAnyWatchlist);
router.delete('/watchlist/empty-all', authMiddleware, emptyAllWatchlists);
router.get('/watchlist/all-items', authMiddleware, getAllWatchlistItems);
router.delete('/watchlist/universal-remove', authMiddleware, universalRemoveFromWatchlist);
module.exports = router;