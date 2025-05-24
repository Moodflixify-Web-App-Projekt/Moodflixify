import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getUserProfile } from '../services/auth.js'; // Import getUserProfile

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const userData = await getUserProfile();
                    setUser(userData);
                } catch (error) {
                    console.error("Failed to fetch user profile on context load:", error);
                    logout(); // Log out if token is invalid or profile can't be fetched
                }
            }
        };
        fetchUserData();
    }, [token]); // Rerun when token changes

    const login = async (email, password) => {
        try {
            const data = await loginUser(email, password);
            setToken(data.token);
            // On successful login, the backend returns user object. Use that directly.
            setUser({ id: data.user._id, username: data.user.username, email: data.user.email });
            localStorage.setItem('token', data.token);
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (username, email, password) => {
        try {
            const data = await registerUser(username, email, password);
            setToken(data.token);
            // On successful registration, the backend returns user object. Use that directly.
            setUser({ id: data.user._id, username: data.user.username, email: data.user.email });
            localStorage.setItem('token', data.token);
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}