const axios = require('axios');
const MoodWatchlist = require('../models/moodWatchistModel');
const Movie = require('../models/movie');
const Series = require('../models/series');
const Song = require('../models/song');

const getSpotifyToken = async () => {
    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
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
        const tmdbResponse = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${mood}`
        );
        const movies = tmdbResponse.data.results.slice(0, 5).map((movie) => ({
            tmdbId: movie.id.toString(),
            title: movie.title,
            mood,
        }));
        const tmdbSeriesResponse = await axios.get(
            `https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_API_KEY}&query=${mood}`
        );
        const series = tmdbSeriesResponse.data.results.slice(0, 5).map((item) => ({
            tmdbId: item.id.toString(),
            title: item.name,
            mood,
        }));
        const spotifyToken = await getSpotifyToken();
        const spotifyResponse = await axios.get(
            `https://api.spotify.com/v1/search?q=${mood}&type=track&limit=5`,
            {
                headers: { Authorization: `Bearer ${spotifyToken}` },
            }
        );
        const songs = spotifyResponse.data.tracks.items.map((track) => ({
            spotifyId: track.id,
            title: track.name,
            artist: track.artists[0].name,
            mood,
        }));
        res.json({ movies, series, songs });
    } catch (error) {
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
        if (type === 'movie') {
            const movie = new Movie({ ...item, addedBy: req.user.id });
            await movie.save();
            watchlist.movies.push(movie._id);
        } else if (type === 'series') {
            const seriesItem = new Series({ ...item, addedBy: req.user.id });
            await seriesItem.save();
            watchlist.series.push(seriesItem._id);
        } else if (type === 'song') {
            const song = new Song({ ...item, addedBy: req.user.id });
            await song.save();
            watchlist.songs.push(song._id);
        }
        await watchlist.save();
        res.status(201).json(watchlist);
    } catch (error) {
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
        res.status(500).json({ message: 'Error fetching watchlist' });
    }
};

module.exports = { getRecommendations, addToWatchlist, getWatchlist };