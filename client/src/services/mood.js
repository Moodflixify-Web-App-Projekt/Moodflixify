import { apiCall } from './api.js';

export const getRecommendations = (mood, token) => {
    return apiCall(`/api/mood/recommendations?mood=${mood}`, 'GET', null, token);
};