
// REGISTER
// LOGOUT
import { createAsyncThunk } from '@reduxjs/toolkit';
import api, { fetchCsrfCookie } from '../../api/axios';
import axios from 'axios';

// URL racine de l'API (sans suffixe /api)
const ROOT = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

//   Assure que le cookie CSRF est présent (Laravel Sanctum)
// fallback avec axios si fetchCsrfCookie échoue

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
      // Assure que le token CSRF est présent
      await fetchCsrfToken();
      

      const response = await api.post('/login', credentials);
      console.log('Login response:', response.data);


      // Le backend renvoie directement { message, user }
      return response.data;

    } catch (error) {
      // Gestion des erreurs
      return rejectWithValue(error.response?.data || 'Erreur lors du login');
    }
  }
);


// REGISTER
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      await fetchCsrfToken();
      const response = await api.post('/register', data);
      try {
        const userRes = await api.get('/api/user');
        const fetchedUser = userRes.data?.user ? userRes.data.user : userRes.data;
        return { user: fetchedUser || response.data.user || response.data };
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
      await api.post('/logout'); // Breeze supporte /logout avec cookies
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Erreur lors de la d\u00e9connexion');
    }
  }
);
