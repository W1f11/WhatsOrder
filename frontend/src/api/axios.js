import axios from 'axios';

// Build a safe baseURL from VITE_API_URL or default to localhost.
const rawBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
// Normalize: remove trailing slash
const normalized = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
// Ensure the API prefix is present. If user provided an URL already pointing to /api, keep as-is.
const baseURL = normalized.endsWith('/api') ? normalized : `${normalized}/api`;

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Helper to get CSRF token from meta tag or cookie
const getCsrfToken = () => {
    // Try to get from meta tag first (Laravel standard)
    const metaToken = document.querySelector('meta[name="csrf-token"]');
    if (metaToken) {
        return metaToken.getAttribute('content');
    }
    
    // Fallback: try to get from cookies
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'XSRF-TOKEN') {
            return decodeURIComponent(value);
        }
    }
    
    return null;
};

// Add CSRF token to request headers before sending
api.interceptors.request.use((config) => {
    const token = getCsrfToken();
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
