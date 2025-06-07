import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';

function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handlePlay = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="welcome-container">
            <div className="welcome-card">
                <h1>Welcome to Moodflixify</h1>
                <p>Entertainment that suits every mood</p>
                <div className="play-button" onClick={handlePlay}>
                    <p> ▶ </p>
                </div>
            </div>
        </div>
    );
}

export default Home;