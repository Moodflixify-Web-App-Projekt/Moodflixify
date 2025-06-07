import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import MovieCard from '../components/movieCard.jsx';
import { getRecommendations, addToWatchlist } from '../services/mood.js';
import { useAuth } from '../context/authContext.jsx';

// Step 1: Mood Selection Page
function MoodSelection() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const moods = [
        { name: 'Happy', emoji: '😊'},
        { name: 'Angry', emoji: '👿'},
        { name: 'Relaxed', emoji: '😎'},
        { name: 'Stressed', emoji: '🙀'},
        { name: 'Sad', emoji: '😭'}
    ];

    const handleMoodSelect = (moodName) => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/dashboard/media', { state: { mood: moodName } });
    };

    return (
        <div className="dashboard-card-container">
            <div className="dashboard-card">
                <h2 className="text-2xl font-bold mb-6">How do you feel today?</h2>
                <div className="mood-buttons">
                    {moods.map((mood) => (
                        <button key={mood.name} onClick={() => handleMoodSelect(mood.name)} className="mood-btn">
                            {mood.name} {mood.emoji}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Step 2: Media Selection Page
function MediaSelection() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [selectedMood] = useState(state?.mood || 'Happy');
    const [selectedMedia, setSelectedMedia] = useState(['Movies', 'Series', 'Music']);

    const mediaTypes = ['Movies', 'Series', 'Music'];

    const handleMediaToggle = (media) => {
        let newSelection = [...selectedMedia];
        if (newSelection.includes(media)) {
            if (newSelection.length > 1) newSelection = newSelection.filter((m) => m !== media);
        } else {
            newSelection.push(media);
        }
        if (newSelection.length === 0) newSelection = ['Movies'];
        setSelectedMedia(newSelection);
    };

    const handleContinue = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/dashboard/recommendations', { state: { mood: selectedMood, media: selectedMedia } });
    };

    return (
        <div className="dashboard-card-container">
            <div className="dashboard-card">
                <h2 className="text-2xl font-bold mb-6">Choose your Media</h2>
                <div className="media-buttons">
                    {mediaTypes.map((media) => (
                        <button
                            key={media}
                            onClick={() => handleMediaToggle(media)}
                            className={selectedMedia.includes(media) ? '' : 'opacity-50'}
                        >
                            {media}
                        </button>
                    ))}
                </div>
                <button className="start-button mt-6" onClick={handleContinue}>
                    Start
                </button>
            </div>
        </div>
    );
}

// Step 3: Recommendations Page
function Recommendations() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [selectedMood] = useState(state?.mood || 'Happy');
    const [selectedMedia] = useState(state?.media || ['Movies', 'Series', 'Music']);
    const [recommendations, setRecommendations] = useState({ movies: [], series: [], songs: [] });
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchData = async () => {
            try {
                const data = await getRecommendations(selectedMood, token);
                setRecommendations(data);
            } catch (error) {
                setError('Failed to load recommendations');
            }
        };
        fetchData();
    }, [selectedMood, user, token, navigate]);

    const handleAddToWatchlist = async (type, item) => {
        try {
            await addToWatchlist(selectedMood, type, item, token);
            alert('Added to Watchlist');
        } catch (error) {
            setError('Failed to add to watchlist');
        }
    };

    const filteredRecommendations = {
        movies: selectedMedia.includes('Movies') ? recommendations.movies : [],
        series: selectedMedia.includes('Series') ? recommendations.series : [],
        songs: selectedMedia.includes('Music') ? recommendations.songs : [],
    };

    return (
        <div className="min-h-screen p-4 bg-[#1A202C]">
            <div className="w-full max-w-5xl mx-auto">
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <h2 className="text-2xl font-bold mb-6 text-center">Recommendations for {selectedMood} Mood</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-center">MOVIES</h3>
                        {filteredRecommendations.movies.length > 0 ? (
                            filteredRecommendations.movies.map((movie) => (
                                <div key={movie.tmdbId} className="relative mb-4">
                                    <MovieCard item={movie} type="movie" />
                                    <button
                                        onClick={() => handleAddToWatchlist('movie', movie)}
                                        className="add-button"
                                    >
                                        Add to watchlist
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center">No movies to display</p>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-center">SERIES</h3>
                        {filteredRecommendations.series.length > 0 ? (
                            filteredRecommendations.series.map((series) => (
                                <div key={series.tmdbId} className="relative mb-4">
                                    <MovieCard item={series} type="series" />
                                    <button
                                        onClick={() => handleAddToWatchlist('series', series)}
                                        className="add-button"
                                    >
                                        Add to watchlist
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center">No series to display</p>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-center">MUSIC</h3>
                        {filteredRecommendations.songs.length > 0 ? (
                            filteredRecommendations.songs.map((song) => (
                                <div key={song.spotifyId} className="relative mb-4">
                                    <MovieCard item={song} type="song" />
                                    <button
                                        onClick={() => handleAddToWatchlist('song', song)}
                                        className="add-button"
                                    >
                                        Add to watchlist
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center">No music to display</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main Dashboard Component with Sub-Routes
function Dashboard() {
    return (
        <Routes>
            <Route path="/" element={<MoodSelection />} />
            <Route path="/media" element={<MediaSelection />} />
            <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
    );
}

export default Dashboard;