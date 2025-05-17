import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Dashboard from './pages/dashboard.jsx';
import Profile from './pages/profile.jsx';
import Watchlist from './pages/watchlist.jsx';

function App() {
    return (
        <div className="min-h-screen bg-[#1A202C] text-white font-segoe">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/watchlist" element={<Watchlist />} />
            </Routes>
        </div>
    );
}

export default App;