
// REGISTER
// LOGOUT
import { createAsyncThunk } from '@reduxjs/toolkit';
import api, { fetchCsrfCookie } from '../../api/axios';
import axios from 'axios';

// Build root host (no /api suffix)
const ROOT = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

// Ensure CSRF cookie is set (Laravel Sanctum expects /sanctum/csrf-cookie at root)
const fetchCsrfToken = async () => {
  try {
    const ok = await fetchCsrfCookie();
    if (ok) return true;
    // fallback
    try {
      await axios.get(`${ROOT}/sanctum/csrf-cookie`, { withCredentials: true });
      return true;
    } catch {
      console.warn('fetchCsrfToken fallback failed');
      return false;
    }
  } catch {
    console.warn('fetchCsrfToken failed');
    return false;
  }
};

// LOGIN
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Ensure CSRF cookie is set
      await fetchCsrfToken();
      // POST to API login endpoint
      const response = await api.post('/api/login', credentials);
      // After login, fetch authenticated user
      try {
        const userRes = await api.get('/api/user');
        return { user: userRes.data.user || response.data.user };
      } catch {
        // fallback: return whatever the login returned
        return { user: response.data.user || response.data };
      }
    } catch (error) {
      // Retourne la réponse serveur si disponible, sinon le message d'erreur Axios
      return rejectWithValue(error.response?.data || error.message || 'Erreur lors du login');
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      await fetchCsrfToken();
      const response = await api.post('/api/register', data);
      try {
        const userRes = await api.get('/api/user');
        return { user: userRes.data.user || response.data.user };
      } catch {
        return { user: response.data.user || response.data };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Erreur lors de l\'inscription');
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await fetchCsrfToken();
      await api.post('/api/logout'); // Breeze supporte /logout avec cookies
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Erreur lors de la d\u00e9connexion');
    }
  }
);
