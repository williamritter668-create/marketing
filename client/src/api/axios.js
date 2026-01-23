import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', // Dynamic URL for Production
    withCredentials: true, // Important for HttpOnly Cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
