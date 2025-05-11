import api from './api.js';

export const getRecommendations = async (mood, token) => {
    const response = await api.get(`/mood/recommendations?mood=${mood}`);
    return response.data;
};