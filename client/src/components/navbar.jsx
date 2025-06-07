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
            <div className="relative">
                {user ? (
                    <>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="nav-user-icon"
                        >
                            👤 {user.username}
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#4A5568] rounded-lg shadow-lg z-10">
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
                                    Watchlist
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="nav-buttons-logout"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </>
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
            </div>
        </nav>
    );
}

export default Navbar;