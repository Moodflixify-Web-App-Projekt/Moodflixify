const BASE_URL = 'http://localhost:5000';

export const apiCall = async (endpoint, method = 'GET', body = null, token = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...(body && { body: JSON.stringify(body) }),
    };

    try {
        console.log(`Making API call to: ${BASE_URL}${endpoint}`);
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`API call failed with status ${response.status}`);
        }
        const data = await response.json();
        console.log(`API response from ${endpoint}:`, data);
        return data;
    } catch (error) {
        console.error(`Error in apiCall (${endpoint}):`, error);
        throw error;
    }
};