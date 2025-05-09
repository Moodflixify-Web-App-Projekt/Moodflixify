import { apiCall } from './api.js';

export const login = (email, password) => {
    return apiCall('/api/auth/login', 'POST', { email, password });
};

export const register = (username, email, password) => {
    return apiCall('/api/auth/register', 'POST', { username, email, password });
};