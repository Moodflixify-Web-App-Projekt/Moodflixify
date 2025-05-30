import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import logo from '../assets/Logo02.drawio.png';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(email, password);
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.log(err);
            setError('Invalid email or password');
        }
    };

    return (
        <div className="login-register-card-container">
            <div className="login-register-card">
                <div className="user-icon">👤</div>
                <img src={logo} className="logo" alt="logo" />
                <h2>Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;