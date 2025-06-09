import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import { getWatchlist, universalRemoveFromWatchlist, emptyAllWatchlists } from '../services/mood.js';
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

    // NEW: Function to handle removing a single item from the watchlist
    const handleRemoveFromWatchlist = async (itemId) => {
        try {
            // Call the new universal backend service to remove the item, passing only itemId
            await universalRemoveFromWatchlist(itemId);
            // After successful removal, re-fetch the watchlist to update the UI
            const updatedWatchlist = await getWatchlist(token);
            setWatchlist(updatedWatchlist);
            setError(''); // Clear any previous errors
        } catch (err) {
            console.error("Error removing from watchlist:", err);
            setError('Failed to remove item from watchlist');
        }
    };

    // NEW: Function to handle emptying the entire watchlist
    const handleEmptyWatchlist = async () => {
        try {
            // Call the backend service to empty all watchlists for the user
            await emptyAllWatchlists();
            // After successful emptying, re-fetch the watchlist to update the UI (it should now be empty)
            const updatedWatchlist = await getWatchlist(token);
            setWatchlist(updatedWatchlist);
            setError(''); // Clear any previous errors
        } catch (err) {
            console.error("Error emptying watchlist:", err);
            setError('Failed to empty watchlist');
        }
    };

    return (
        <div className="watchlist-container">
            {/* NEW: Wrapper div for the title and the "Empty Watchlist" button */}
            <div className="flex justify-between items-center mb-4">
                <h2>Your Watchlist/Playlist</h2>
                {/* NEW: Empty Watchlist button, shown only if there are items */}
                {allItems.length > 0 && (
                    <button
                        onClick={handleEmptyWatchlist}
                        className="empty-button"
                    >
                        <span className="mr-2">🗑️</span> Empty Watchlist/Playlist
                    </button>
                )}
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {allItems.length > 0 ? (
                <div className="watchlist-grid">
                    {allItems.map((item, index) => (
                        // NEW: Wrap MovieCard in a div to allow relative positioning for the remove button
                        <div key={index} className="watchlist-grid-2"> {/* Original key={index} preserved */}
                            <MovieCard item={item} type={item.type} />
                            {/* NEW: "X" button for individual item removal */}
                            <button
                                onClick={() => handleRemoveFromWatchlist(item._id)} // Pass item._id for removal
                                className="x-button"
                            >
                                Remove from watchlist/playlist ✖
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                // NEW: Updated message for empty watchlist
                <p className="watchlist-empty">No items added to your watchlist/playlist yet.</p>
            )}
        </div>
    );
}

export default Watchlist;