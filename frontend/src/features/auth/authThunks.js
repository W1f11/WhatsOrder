
// REGISTER
// LOGOUT
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import axios from 'axios';

// Build root host (no /api suffix)
const ROOT = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

// Ensure CSRF cookie is set (Laravel Sanctum expects /sanctum/csrf-cookie at root)
const fetchCsrfToken = async () => {
  try {
    await axios.get(`${ROOT}/sanctum/csrf-cookie`, { withCredentials: true });
  } catch {
    // ignore (backend may not have sanctum endpoint)
  }
};

// LOGIN
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      await fetchCsrfToken();
      const response = await api.post('/login', credentials);
      return response.data; // retourne user
    } catch (error) {
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
      return response.data; // retourne user
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur lors de l\'inscription');
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
    } catch  {
      return rejectWithValue('Erreur lors de la d\u00e9connexion');
    }
  }
);
