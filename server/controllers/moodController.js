const axios = require('axios');
const MoodWatchlist = require('../models/moodWatchlistModel');
const Movie = require('../models/movie');
const Series = require('../models/series');
const Song = require('../models/song');
const moodConfig = require('../config/moodConfig');

const getSpotifyToken = async () => {
    const response = await axios.post(
        'https://accounts.spotify.com/api/token', // Corrected Spotify API endpoint
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
        const movies = tmdbMovieResponse.data.results.slice(0, 5).map((movie) => ({
            tmdb_id: movie.id.toString(), // Ensure tmdb_id is a string
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            genre_ids: movie.genre_ids,
            poster_path: movie.poster_path, // Add poster_path
        }));

        const tmdbSeriesResponse = await axios.get(
            `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&with_genres=${config.tmdbSeriesGenres}`
        );
        const series = tmdbSeriesResponse.data.results.slice(0, 5).map((seriesItem) => ({
            tmdb_id: seriesItem.id.toString(), // Ensure tmdb_id is a string
            name: seriesItem.name,
            overview: seriesItem.overview,
            first_air_date: seriesItem.first_air_date,
            genre_ids: seriesItem.genre_ids,
            poster_path: seriesItem.poster_path, // Add poster_path
        }));

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
            album_image_url: song.album.images[0]?.url, // Add album_image_url
        }));

        res.json({ movies, series, songs });
    } catch (error) {
        console.error('Error fetching recommendations:', error.message);
        console.error('Full error:', error.response ? error.response.data : error); // Log full error response for debugging
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

module.exports = { getRecommendations, addToWatchlist, getWatchlist };