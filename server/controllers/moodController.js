const axios = require('axios');
const MoodWatchlist = require('../models/moodWatchlistModel');
const Movie = require('../models/movie');
const Series = require('../models/series');
const Song = require('../models/song');
const moodConfig = require('../config/moodConfig');

const getSpotifyToken = async () => {
    const response = await axios.post(
        'https://accounts.spotify.com/api/token', // THIS IS THE CORRECT URL
        'grant_type=client_credentials',
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(
                    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                ).toString('base64')}`,
            },
        }
    );
    return response.data.access_token;
};

const getRecommendations = async (req, res) => {
    const { mood } = req.query;
    try {
        const config = moodConfig[mood] || moodConfig['Happy'];

        const tmdbMovieResponse = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${config.tmdbMovieGenres}`
        );
        const moviesPromises = tmdbMovieResponse.data.results.slice(0, 5).map(async (movie) => {
            let director = 'N/A';
            try {
                const creditsResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${process.env.TMDB_API_KEY}`
                );
                const directorEntry = creditsResponse.data.crew.find(crew => crew.job === 'Director');
                if (directorEntry) {
                    director = directorEntry.name;
                }
            } catch (creditError) {
                console.warn(`Could not fetch director for movie ${movie.id}:`, creditError.message);
            }

            return {
                tmdb_id: movie.id.toString(),
                title: movie.title,
                overview: movie.overview,
                release_date: movie.release_date,
                genre_ids: movie.genre_ids,
                poster_path: movie.poster_path,
                mood: mood,
                director: director,
            };
        });
        const movies = await Promise.all(moviesPromises);

        const tmdbSeriesResponse = await axios.get(
            `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&with_genres=${config.tmdbSeriesGenres}`
        );
        const seriesPromises = tmdbSeriesResponse.data.results.slice(0, 5).map(async (seriesItem) => {
            let director = 'N/A'; // For series, often referred to as 'Creator' or 'Director'
            try {
                // For TV series, credits are structured differently; often looking for 'Created By' or specific crew jobs
                const creditsResponse = await axios.get(
                    `https://api.themoviedb.org/3/tv/${seriesItem.id}/credits?api_key=${process.env.TMDB_API_KEY}`
                );
                const directorEntry = creditsResponse.data.crew.find(crew => crew.job === 'Director' || crew.job === 'Creator');
                if (directorEntry) {
                    director = directorEntry.name;
                } else if (creditsResponse.data.created_by && creditsResponse.data.created_by.length > 0) {
                    director = creditsResponse.data.created_by.map(creator => creator.name).join(', ');
                }
            } catch (creditError) {
                console.warn(`Could not fetch director/creator for series ${seriesItem.id}:`, creditError.message);
            }

            return {
                tmdb_id: seriesItem.id.toString(),
                name: seriesItem.name,
                overview: seriesItem.overview,
                first_air_date: seriesItem.first_air_date,
                genre_ids: seriesItem.genre_ids,
                poster_path: seriesItem.poster_path,
                mood: mood,
                director: director, // NEW: Add director for series
            };
        });
        const series = await Promise.all(seriesPromises);

        const spotifyToken = await getSpotifyToken();
        const spotifyResponse = await axios.get(
            `https://api.spotify.com/v1/search?q=${config.spotifyQuery}&type=track&limit=5`,
            {
                headers: {
                    Authorization: `Bearer ${spotifyToken}`,
                },
            }
        );
        const songs = spotifyResponse.data.tracks.items.map((song) => ({
            spotify_id: song.id,
            name: song.name,
            artists: song.artists.map((artist) => artist.name),
            album: song.album.name,
            duration_ms: song.duration_ms,
            album_image_url: song.album.images[0]?.url || null,
            mood: mood,
        }));

        res.json({ movies, series, songs });
    } catch (error) {
        console.error('Error fetching recommendations:', error.message);
        console.error('Full error:', error.response ? error.response.data : error);
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
};

const addToWatchlist = async (req, res) => {
    const { mood, type, item } = req.body;
    try {
        let watchlist = await MoodWatchlist.findOne({ userId: req.user.id, mood });
        if (!watchlist) {
            watchlist = new MoodWatchlist({ userId: req.user.id, mood, movies: [], series: [], songs: [] });
        }

        let contentItem;
        if (type === 'movie') {
            contentItem = await Movie.findOne({ tmdb_id: item.tmdb_id });
            if (!contentItem) {
                contentItem = new Movie({ ...item });
                await contentItem.save();
            }
            if (!watchlist.movies.includes(contentItem._id)) { // Prevent duplicates in watchlist
                watchlist.movies.push(contentItem._id);
            }
        } else if (type === 'series') {
            contentItem = await Series.findOne({ tmdb_id: item.tmdb_id });
            if (!contentItem) {
                contentItem = new Series({ ...item });
                await contentItem.save();
            }
            if (!watchlist.series.includes(contentItem._id)) { // Prevent duplicates in watchlist
                watchlist.series.push(contentItem._id);
            }
        } else if (type === 'song') {
            contentItem = await Song.findOne({ spotify_id: item.spotify_id });
            if (!contentItem) {
                contentItem = new Song({ ...item });
                await contentItem.save();
            }
            if (!watchlist.songs.includes(contentItem._id)) { // Prevent duplicates in watchlist
                watchlist.songs.push(contentItem._id);
            }
        }

        await watchlist.save();
        res.status(201).json(watchlist);
    } catch (error) {
        console.error('Error adding to watchlist:', error.message);
        console.error('Full error:', error.response ? error.response.data : error);
        res.status(500).json({ message: 'Error adding to watchlist' });
    }
};

const getWatchlist = async (req, res) => {
    try {
        const watchlist = await MoodWatchlist.find({ userId: req.user.id })
            .populate('movies')
            .populate('series')
            .populate('songs');
        res.json(watchlist);
    } catch (error) {
        console.error('Error fetching watchlist:', error.message);
        res.status(500).json({ message: 'Error fetching watchlist' });
    }
};

const removeFromWatchlist = async (req, res) => {
    const { mood, type, itemId } = req.body; // itemId is the _id of the Movie, Series, or Song document
    try {
        const watchlist = await MoodWatchlist.findOne({ userId: req.user.id, mood });

        if (!watchlist) {
            return res.status(404).json({ message: 'Watchlist not found for this mood' });
        }

        // Remove the item from the appropriate array based on its type
        if (type === 'movie') {
            watchlist.movies = watchlist.movies.filter(id => id.toString() !== itemId);
        } else if (type === 'series') {
            watchlist.series = watchlist.series.filter(id => id.toString() !== itemId);
        } else if (type === 'song') {
            watchlist.songs = watchlist.songs.filter(id => id.toString() !== itemId);
        } else {
            return res.status(400).json({ message: 'Invalid item type' });
        }

        await watchlist.save();
        res.json({ message: 'Item removed from watchlist', watchlist });
    } catch (error) {
        console.error('Error removing from watchlist:', error.message);
        res.status(500).json({ message: 'Error removing from watchlist' });
    }
};

// Existing function to empty the watchlist for a specific mood
const emptyWatchlist = async (req, res) => {
    const { mood } = req.body;
    try {
        // Find and delete the MoodWatchlist document for the user and specific mood
        const result = await MoodWatchlist.deleteOne({ userId: req.user.id, mood });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Watchlist not found for this mood or already empty' });
        }

        res.json({ message: `Watchlist for mood '${mood}' emptied successfully` });
    } catch (error) {
        console.error('Error emptying watchlist:', error.message);
        res.status(500).json({ message: 'Error emptying watchlist' });
    }
};

// Existing function to remove an item from ANY watchlist entry for the user (requires type)
const removeItemFromAnyWatchlist = async (req, res) => {
    const { type, itemId } = req.body; // No mood needed for unified removal
    try {
        const allWatchlists = await MoodWatchlist.find({ userId: req.user.id });
        let itemRemoved = false;

        for (const watchlist of allWatchlists) {
            let initialLength;
            if (type === 'movie') {
                initialLength = watchlist.movies.length;
                watchlist.movies = watchlist.movies.filter(id => id.toString() !== itemId);
                if (watchlist.movies.length < initialLength) {
                    itemRemoved = true;
                }
            } else if (type === 'series') {
                initialLength = watchlist.series.length;
                watchlist.series = watchlist.series.filter(id => id.toString() !== itemId);
                if (watchlist.series.length < initialLength) {
                    itemRemoved = true;
                }
            } else if (type === 'song') {
                initialLength = watchlist.songs.length;
                watchlist.songs = watchlist.songs.filter(id => id.toString() !== itemId);
                if (watchlist.songs.length < initialSongsLength) {
                    itemRemoved = true;
                }
            }
            // Save the updated watchlist if any changes were made
            if (itemRemoved) {
                await watchlist.save();
                break; // Item found and removed, no need to check other watchlists
            }
        }

        if (!itemRemoved) {
            return res.status(404).json({ message: 'Item not found in any watchlist' });
        }

        res.json({ message: 'Item removed from watchlist successfully' });
    } catch (error) {
        console.error('Error removing item from any watchlist:', error.message);
        res.status(500).json({ message: 'Error removing item from watchlist' });
    }
};

// Existing function to empty ALL watchlist entries for the user
const emptyAllWatchlists = async (req, res) => {
    try {
        // Delete all MoodWatchlist documents for the current user
        const result = await MoodWatchlist.deleteMany({ userId: req.user.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No watchlist entries found for this user or already empty' });
        }

        res.json({ message: 'All watchlist entries emptied successfully' });
    } catch (error) {
        console.error('Error emptying all watchlists:', error.message);
        res.status(500).json({ message: 'Error emptying all watchlists' });
    }
};

// Existing function to get all watchlist items flattened on the backend
const getAllWatchlistItems = async (req, res) => {
    try {
        const watchlists = await MoodWatchlist.find({ userId: req.user.id })
            .populate('movies')
            .populate('series')
            .populate('songs');

        const allItems = watchlists.flatMap((entry) => [
            // Ensure to convert Mongoose documents to plain objects for spread syntax
            ...entry.movies.map((item) => ({ ...item.toObject(), type: 'movie', mood: entry.mood })),
            ...entry.series.map((item) => ({ ...item.toObject(), type: 'series', mood: entry.mood })),
            ...entry.songs.map((item) => ({ ...item.toObject(), type: 'song', mood: entry.mood })),
        ]);

        res.json(allItems);
    } catch (error) {
        console.error('Error fetching all watchlist items:', error.message);
        res.status(500).json({ message: 'Error fetching all watchlist items' });
    }
};

// NEW: Function to remove an item from ANY watchlist entry for the user, determining type internally
const universalRemoveFromWatchlist = async (req, res) => {
    const { itemId } = req.body; // Only itemId is needed from frontend
    try {
        const allWatchlists = await MoodWatchlist.find({ userId: req.user.id });
        let itemRemoved = false;

        for (const watchlist of allWatchlists) {
            let initialMoviesLength = watchlist.movies.length;
            watchlist.movies = watchlist.movies.filter(id => id.toString() !== itemId);
            if (watchlist.movies.length < initialMoviesLength) {
                itemRemoved = true;
                await watchlist.save(); // Save if removed from movies
                break; // Item found and removed, no need to check other arrays/watchlists
            }

            let initialSeriesLength = watchlist.series.length;
            watchlist.series = watchlist.series.filter(id => id.toString() !== itemId);
            if (watchlist.series.length < initialSeriesLength) {
                itemRemoved = true;
                await watchlist.save(); // Save if removed from series
                break; // Item found and removed
            }

            let initialSongsLength = watchlist.songs.length;
            watchlist.songs = watchlist.songs.filter(id => id.toString() !== itemId);
            if (watchlist.songs.length < initialSongsLength) {
                itemRemoved = true;
                await watchlist.save(); // Save if removed from songs
                break; // Item found and removed
            }
        }

        if (!itemRemoved) {
            return res.status(404).json({ message: 'Item not found in any watchlist' });
        }

        res.json({ message: 'Item removed from watchlist successfully' });
    } catch (error) {
        console.error('Error removing item universally from watchlist:', error.message);
        res.status(500).json({ message: 'Error removing item from watchlist' });
    }
};


module.exports = { getRecommendations, addToWatchlist, getWatchlist, removeFromWatchlist, emptyWatchlist, removeItemFromAnyWatchlist, emptyAllWatchlists, getAllWatchlistItems, universalRemoveFromWatchlist };