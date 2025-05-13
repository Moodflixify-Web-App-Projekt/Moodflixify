import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import MovieCard from '../components/movieCard.jsx';
import { getRecommendations } from '../services/mood.js';
import { useAuth } from '../context/authContext.jsx';

// Step 1: Mood Selection Page
function MoodSelection() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const moods = ['Happy', 'Angry', 'Relaxed', 'Stressed', 'Sad'];

    const handleMoodSelect = (mood) => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/dashboard/media', { state: { mood } });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#1A202C]">
            <div className="dashboard-card">
                <h2>How do you feel today?</h2>
                <div className="mood-buttons">
                    {moods.map((mood) => (
                        <button key={mood} onClick={() => handleMoodSelect(mood)}>
                            {mood} 😊
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#1A202C]">
            <div className="dashboard-card">
                <h2>Choose your Media</h2>
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
                <button className="start-button" onClick={handleContinue}>
                    Start
                </button>
            </div>
        </div>
    );
}

// Step 3: Recommendations Page
function Recommendations() {
    const { user } = useAuth();
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
                const data = await getRecommendations(selectedMood, user.token);
                setRecommendations(data);
            } catch (error) {
                setError('Failed to load recommendations');
            }
        };
        fetchData().then(() => {

        });
    }, [selectedMood, user, navigate]);

    const filteredRecommendations = {
        movies: selectedMedia.includes('Movies') ? recommendations.movies : [],
        series: selectedMedia.includes('Series') ? recommendations.series : [],
        songs: selectedMedia.includes('Music') ? recommendations.songs : [],
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#1A202C]">
            <div className="w-full max-w-4xl">
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <h2 className="text-2xl font-bold mb-4 text-center">Recommendations for {selectedMood} Mood</h2>
                <div className="recommendations-grid">
                    {filteredRecommendations.movies.map((movie) => (
                        <div key={movie.tmdbId} className="recommendation-card">
                            <div className="placeholder">Infotext</div>
                            <h3>{movie.title}</h3>
                        </div>
                    ))}
                    {filteredRecommendations.series.map((series) => (
                        <div key={series.tmdbId} className="recommendation-card">
                            <div className="placeholder">Infotext</div>
                            <h3>{series.title}</h3>
                        </div>
                    ))}
                    {filteredRecommendations.songs.map((song) => (
                        <div key={song.spotifyId} className="recommendation-card">
                            <div className="placeholder">Infotext</div>
                            <h3>{song.title}</h3>
                            <p>{song.artist}</p>
                        </div>
                    ))}
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