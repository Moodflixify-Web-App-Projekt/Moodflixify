const axios = require('axios');
const Movie = require('../models/movie');
const Series = require('../models/series');
const Song = require('../models/song');

exports.getMoodRecommendations = async (req, res) => {
    const { mood } = req.query;
    try {
        // TMDb API for movies and series
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
            params: { api_key: process.env.TMDB_API_KEY, with_genres: moodToGenre(mood) },
        });
        const movies = tmdbResponse.data.results.map(m => new Movie(m).save());

        const seriesResponse = await axios.get(`https://api.themoviedb.org/3/discover/tv`, {
            params: { api_key: process.env.TMDB_API_KEY, with_genres: moodToGenre(mood) },
        });
        const series = seriesResponse.data.results.map(s => new Series(s).save());

        // Spotify API for songs
        const spotifyToken = await getSpotifyToken();
        const spotifyResponse = await axios.get('https://api.spotify.com/v1/recommendations', {
            headers: { Authorization: `Bearer ${spotifyToken}` },
            params: { seed_genres: moodToGenre(mood), limit: 10 },
        });
        const songs = spotifyResponse.data.tracks.map(s => new Song(s).save());

        await Promise.all([...movies, ...series, ...songs]);
        res.json({ movies, series, songs });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
};

const moodToGenre = (mood) => {
    const genreMap = { happy: 'comedy', sad: 'drama', excited: 'action' };
    return genreMap[mood.toLowerCase()] || 'all';
};

const getSpotifyToken = async () => {
    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        auth: { username: process.env.SPOTIFY_CLIENT_ID, password: process.env.SPOTIFY_CLIENT_SECRET },
    });
    return response.data.access_token;
};