import axios from 'axios';

/**
 * api.js - Axios configuration
 * 
 * Development mein: http://localhost:8080
 * Production mein: Render backend URL (env variable se aayega)
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds (Render free tier thoda slow hota hai startup pe)
});

// Request interceptor - JWT token automatically add karta hai
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - 401 pe logout karta hai
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;