import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import { getUserProfile } from '../services/auth.js';

function Profile() {
    const { user, token, logout } = useAuth(); // Destructure logout from useAuth
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user || !token) {
                setLoading(false);
                navigate('/login'); // Redirect if not authenticated
                return;
            }
            try {
                const userProfile = await getUserProfile();
                setProfile(userProfile);
                setError(''); // Clear any previous errors
            } catch (err) {
                console.error("Error fetching profile:", err); // Log the actual error
                setError('Failed to load profile');
                // Optionally, if the token is invalid, log out the user
                if (err.response && err.response.status === 401) {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, token, navigate, logout]); // Add navigate and logout to dependencies

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[#1A202C]">
                <p className="text-white">Loading profile...</p>
            </div>
        );
    }

    if (!user) { // This check is mostly redundant now due to the useEffect, but good for clarity
        return null; // Or a loading spinner if preferred, as navigate already handles redirect
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#1A202C]">
            <div className="profile-card">
                <div className="user-icon">👤</div>
                <h2>Profile</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {profile ? (
                    <>
                        <p>Username: {profile.username}</p>
                        <p>E-Mail: {profile.email}</p>
                    </>
                ) : (
                    // This block will now likely only show if there's a problem fetching,
                    // and user data from context is incomplete, which should be rare with the fix.
                    <>
                        <p>Username: {user.username || 'N/A'}</p>
                        <p>E-Mail: {user.email || 'N/A'}</p>
                    </>
                )}
                <button onClick={() => navigate('/watchlist')}>
                    View Watchlist
                </button>
            </div>
        </div>
    );
}

export default Profile;