import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import { getUserProfile } from '../services/auth.js';

function Profile() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userProfile = await getUserProfile();
                setProfile(userProfile);
            } catch (err) {
                setError('Failed to load profile');
            }
        };
        if (user && token) {
            fetchProfile();
        }
    }, [user, token]);

    if (!user) {
        return navigate('/login');
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
                    <>
                        <p>Username: {user.username}</p>
                        <p>E-Mail: {user.email}</p>
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