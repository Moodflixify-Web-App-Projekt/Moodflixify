import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MovieCard from '../components/movieCard.jsx';
import { getRecommendations } from '../services/mood.js';
import { useAuth } from '../context/authContext.jsx';

// Mock data for when backend fails
const mockRecommendations = {
    movies: [
        { tmdbId: '1', title: 'Mock Movie', mood: 'Happy' },
        { tmdbId: '2', title: 'Mock Movie', mood: 'Angry' },
        { tmdbId: '3', title: 'Mock Movie', mood: 'Relaxed' },
        { tmdbId: '4', title: 'Mock Movie', mood: 'Stressed' },
        { tmdbId: '5', title: 'Mock Movie', mood: 'Sad' },
    ],
    series: [],
    songs: [],
};

function MoodSelection() {
    const { user } = useAuth() || { user: null };
    const navigate = useNavigate();

    const moods = ['Happy', 'Angry', 'Relaxed', 'Stressed', 'Sad'];

    const handleMoodSelect = (mood) => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/dashboard/recommendations', { state: { mood } });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-center text-white">
                <h2 className="text-xl font-bold mb-4">How do you feel today?</h2>
                <div className="flex flex-wrap justify-center gap-2">
                    {moods.map((mood) => (
                        <button
                            key={mood}
                            onClick={() => handleMoodSelect(mood)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {mood}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Recommendations() {
    const { user } = useAuth() || { user: null };
    const navigate = useNavigate();
    const { state } = useLocation();
    const [selectedMood] = useState(state?.mood || 'Happy');
    const [recommendations, setRecommendations] = useState({ movies: [], series: [], songs: [] });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const data = await getRecommendations(selectedMood, user.token);
                setRecommendations(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                setError('Failed to load. Using mock data.');
                setRecommendations(mockRecommendations);
            }
        };

        fetchData().then(() => {
            console.log("data works");
        }).catch(error => {
            console.error('Error while trying to connect to MongoDB', error);
            process.exit(1);
        });
    }, [selectedMood, user, navigate]);

    const filteredRecommendations = {
        movies: recommendations.movies.filter((item) => item.mood === selectedMood),
        series: [],
        songs: [],
    };

    return (
        <div className="min-h-screen p-4 bg-gray-900">
            <h2 className="text-2xl font-bold text-white text-center mb-4">Recommendations for {selectedMood}</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
                {filteredRecommendations.movies.map((movie) => (
                    <MovieCard key={movie.tmdbId} item={movie} />
                ))}
            </div>
        </div>
    );
}

function Dashboard() {
    const location = useLocation();

    if (location.pathname === '/dashboard') return <MoodSelection />;
    if (location.pathname === '/dashboard/recommendations') return <Recommendations />;
    return <MoodSelection />;
}

export default Dashboard;