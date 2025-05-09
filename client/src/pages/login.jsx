import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth} from "../context/authContext.jsx";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth() || { login: () => {} };
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            setError(null);
            await login(email, password);
        }
        catch(error){
            console.log('Login failed', error);
            setError('Login failed, please check credentials and try again');
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-center text-white">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-Mail"
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4">
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="text-blue-400 hover:underline"
                    >
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;