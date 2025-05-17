import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import { getWatchlist } from '../services/mood.js';
import MovieCard from '../components/movieCard.jsx';

function Watchlist() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [watchlist, setWatchlist] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const data = await getWatchlist(token);
                setWatchlist(data);
            } catch (err) {
                setError('Failed to load watchlist');
            }
        };
        if (user && token) {
            fetchWatchlist().then(() => {
                console.log("fetched watchlist");
            }).catch(err => console.log("couldn't catch watchlist", err));
        }
    }, [user, token]);

    if (!user) {
        return navigate('/login');
    }

    const allItems = watchlist.flatMap((entry) => [
        ...entry.movies.map((item) => ({ ...item, type: 'movie', mood: entry.mood })),
        ...entry.series.map((item) => ({ ...item, type: 'series', mood: entry.mood })),
        ...entry.songs.map((item) => ({ ...item, type: 'song', mood: entry.mood })),
    ]);

    return (
        <div className="watchlist-container">
            <h2>Your Watchlist</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {allItems.length > 0 ? (
                <div className="watchlist-grid">
                    {allItems.map((item, index) => (
                        <MovieCard key={index} item={item} type={item.type} />
                    ))}
                </div>
            ) : (
                <p className="watchlist-empty">No film added yet</p>
            )}
        </div>
    );
}

export default Watchlist;