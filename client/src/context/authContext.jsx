import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/auth.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            setUser({ id: 'user_id_placeholder' }); // Simplified; fetch user data if needed
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const data = await loginUser(email, password);
            setToken(data.token);
            setUser({ id: data.user.id, username: data.user.username, email: data.user.email });
            localStorage.setItem('token', data.token);
        } catch (error) {
            throw new Error('Login failed');
        }
    };

    const register = async (username, email, password) => {
        try {
            const data = await registerUser(username, email, password);
            setToken(data.token);
            setUser({ id: data.user.id, username: data.user.username, email: data.user.email });
            localStorage.setItem('token', data.token);
        } catch (error) {
            throw new Error('Registration failed');
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