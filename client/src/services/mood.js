import api from './api.js';

export const getRecommendations = async (mood, token) => {
    try {
        const response = await api.get(`/mood/recommendations?mood=${mood}`);
        return response.data;
    } catch (error) {
        // Fallback mock data if API fails
        return {
            movies: [
                { tmdbId: '1', title: 'Movie 1', mood },
                { tmdbId: '2', title: 'Movie 2', mood },
            ],
            series: [
                { tmdbId: '1', title: 'Series 1', mood },
                { tmdbId: '2', title: 'Series 2', mood },
            ],
            songs: [
                { spotifyId: '1', title: 'Song 1', artist: 'Artist 1', mood },
                { spotifyId: '2', title: 'Song 2', artist: 'Artist 2', mood },
            ],
        };
    }
};

export const addToWatchlist = async (mood, type, item, token) => {
    const response = await api.post('/mood/watchlist', { mood, type, item });
    return response.data;
};

export const getWatchlist = async (token) => {
    const response = await api.get('/mood/watchlist');
    return response.data;
};

export const removeFromWatchlist = async (mood, type, itemId) => {
    const response = await api.delete('/mood/watchlist/remove', { data: { mood, type, itemId } });
    return response.data;
};

export const emptyWatchlist = async (mood) => {
    const response = await api.delete('/mood/watchlist/empty', { data: { mood } });
    return response.data;
};

export const removeItemFromAnyWatchlist = async (type, itemId) => {
    const response = await api.delete('/mood/watchlist/remove-any', { data: { type, itemId } });
    return response.data;
};

export const emptyAllWatchlists = async () => {
    const response = await api.delete('/mood/watchlist/empty-all');
    return response.data;
};

export const fetchAllWatchlistItems = async () => {
    const response = await api.get('/mood/watchlist/all-items');
    return response.data;
};

export const universalRemoveFromWatchlist = async (itemId) => {
    const response = await api.delete('/mood/watchlist/universal-remove', { data: { itemId } });
    return response.data;
};