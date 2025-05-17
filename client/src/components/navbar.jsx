import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import { useState } from 'react';

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
            <Link to="/" className="text-2xl font-bold text-white">
                <span className="logo-2">M</span>
            </Link>
            <div className="relative">
                {user ? (
                    <>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="bg-[#4A5568] text-white px-4 py-2 rounded hover:bg-[#5A6B88] flex items-center"
                        >
                            👤 {user.username}
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#4A5568] rounded-lg shadow-lg z-10">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-white hover:bg-[#5A6B88]"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/watchlist"
                                    className="block px-4 py-2 text-white hover:bg-[#5A6B88]"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Watchlist
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-white hover:bg-[#5A6B88]"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center">
                        <Link to="/login" className="bg-[#4A5568] text-white px-4 py-2 rounded hover:bg-[#5A6B88] mr-2">
                            Login
                        </Link>
                        <Link to="/register" className="bg-[#4A5568] text-white px-4 py-2 rounded hover:bg-[#5A6B88]">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;