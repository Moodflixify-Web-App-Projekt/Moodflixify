import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import { useState } from 'react';
import logo from '../assets/Logo02.drawio.png';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-[#A3BFFA] p-4 flex justify-between items-center">
            <Link to="/" className="hintergrund-logo">
                <img src={logo} className="logo" alt="logo" />
            </Link>
            {user ? (
                // This is the main container for the user icon and the horizontally expanding menu.
                // The 'menu-expanded' class will trigger the animation and layout adjustments.
                <div className={`user-profile-menu-wrapper ${isDropdownOpen ? 'menu-expanded' : ''}`}>
                    <button // The user icon button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="nav-user-icon"
                    >
                        👤 {user.username}
                    </button>
                    {/* The horizontal menu items container, rendered conditionally AFTER the button */}
                    {isDropdownOpen && (
                        <div className="horizontal-menu-items">
                            <Link
                                to="/profile"
                                className="nav-buttons"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                Profile
                            </Link>
                            <Link
                                to="/watchlist"
                                className="nav-buttons"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                Watchlist/Playlist
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="nav-buttons-logout"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center">
                    <Link to="/login" className="nav-buttons">
                        Login
                    </Link>
                    <Link to="/register" className="nav-buttons">
                        Register
                    </Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;