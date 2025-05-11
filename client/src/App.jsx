import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Dashboard from './pages/dashboard.jsx';
import { useAuth } from './context/authContext.jsx';

function App() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-[#1A202C] text-white font-segoe">
            {/* Navbar */}
            <nav className="bg-[#A3BFFA] p-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-white">M</div> {/* Mockup's logo */}
                <div className="flex items-center">
                    {user ? (
                        <>
                            <button onClick={logout} className="ml-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="ml-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Login</Link>
                            <Link to="/register" className="ml-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Register</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
            </Routes>
        </div>
    );
}

export default App;