import api from './api.js';

export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const registerUser = async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
};

export const getUserProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};