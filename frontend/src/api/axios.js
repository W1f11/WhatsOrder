import axios from 'axios';

// Configure global axios so all imports (axios) use the same defaults
axios.defaults.baseURL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
axios.defaults.withCredentials = true; // always send cookies for Sanctum
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
// Helper to get CSRF token from meta tag or cookie
const getCsrfToken = () => {
    const metaToken = document.querySelector('meta[name="csrf-token"]');
    if (metaToken) return metaToken.getAttribute('content');

    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const idx = cookie.indexOf('=');
        const name = idx > -1 ? cookie.substring(0, idx) : cookie;
        const value = idx > -1 ? cookie.substring(idx + 1) : '';
        if (name === 'XSRF-TOKEN') return decodeURIComponent(value);
    }
    return null;
};

// Let axios automatically read the `XSRF-TOKEN` cookie and send the
// `X-XSRF-TOKEN` header. This is compatible with Laravel Sanctum defaults.
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// Add CSRF token to request headers before sending (set both common header names)
axios.interceptors.request.use((config) => {
    const token = getCsrfToken();
    if (token) {
        config.headers['X-XSRF-TOKEN'] = token;
    }
    return config;
}, (error) => Promise.reject(error));

// Helper to request the Sanctum CSRF cookie from the server
const fetchCsrfCookie = async () => {
    try {
        // use native fetch to avoid axios interceptors recursion
        await fetch(`${axios.defaults.baseURL}/sanctum/csrf-cookie`, { credentials: 'include' });
        return true;
    } catch {
        return false;
    }
};

// Response interceptor: if server returns 419 CSRF (token mismatch),
// fetch CSRF cookie then retry the original request once.
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        if (status === 419 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            const ok = await fetchCsrfCookie();
            if (ok) {
                return axios(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default axios;
