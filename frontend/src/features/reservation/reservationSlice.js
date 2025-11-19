import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ============================
// ROOT DOMAIN
// ============================
const ROOT = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

// ============================
// CSRF for Laravel Breeze/Sanctum
// ============================
const fetchCsrfToken = async () => {
  try {
    await axios.get(`${ROOT}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  } catch (err) {
    console.error("CSRF fetch failed:", err);
  }
};

// ============================
// CREATE RESERVATION
// ============================
export const createReservation = createAsyncThunk(
  "reservation/createReservation",
  async (data, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const user = state.auth?.user;

      if (!user) {
        return rejectWithValue({ message: "Utilisateur non authentifié." });
      }

      await fetchCsrfToken();

      // Requête authentifiée avec cookie + CSRF
      const res = await axios.post(`${ROOT}/api/reservations`, data, {
        withCredentials: true,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ============================
// GET MY RESERVATIONS
// ============================
export const fetchMyReservations = createAsyncThunk(
  "reservation/fetchMyReservations",
  async (_, { rejectWithValue }) => {
    try {
      await fetchCsrfToken();
      const res = await axios.get(`${ROOT}/api/reservations`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ============================
// CANCEL RESERVATION
// ============================
export const cancelReservation = createAsyncThunk(
  "reservation/cancelReservation",
  async (id, { rejectWithValue }) => {
    try {
      await fetchCsrfToken();
      const res = await axios.patch(`${ROOT}/api/reservations/${id}/cancel`, null, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ============================
// SLICE
// ============================
const reservationSlice = createSlice({
  name: "reservation",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Erreur création réservation";
      })

      // FETCH
      .addCase(fetchMyReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Erreur récupération réservations";
      })

      // CANCEL
      .addCase(cancelReservation.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      });
  },
});

export default reservationSlice.reducer;
