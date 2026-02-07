import axios from 'axios';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

// Get the host IP automatically from Expo (useful for physical devices)
// This will resolve to your computer's IP when using Expo Go
const host = Constants.expoConfig?.hostUri?.split(':').shift() || 'localhost';
const BASE_URL = `http://${host}:5000/api`;

console.log('Backend pointing to:', BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// Add logging for easier debugging
api.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2));
    return request;
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.message);
        if (error.response) {
            console.error('Error Data:', error.response.data);
        }
        return Promise.reject(error);
    }
);

export const getHabits = (date) => api.get(`/habits?date=${date}`);
export const addHabit = (habit) => api.post('/habits', habit);
export const toggleStatus = (id, date) => api.patch(`/habits/${id}/toggle-status`, { date });
export const deleteHabit = (id) => api.delete(`/habits/${id}`);

export default api;
