import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../services/auth.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({token});
        }
    }, []);

    const login = async (email, password) => {
        try{
            const data = await apiLogin(email, password);
            localStorage.setItem('token', data.token);
            setUser({ token: data.token });
            navigate('/dashboard');
        }
        catch(error){
            console.error('Login failed', error);
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try{
            const data = await apiRegister(username, email, password);
            localStorage.setItem('token', data.token);
            setUser({ token: data.token });
            navigate('/dashboard');
        }
        catch(error){
            console.error('Register failed', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}