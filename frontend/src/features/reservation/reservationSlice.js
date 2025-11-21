import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// ============================
// CREATE RESERVATION
// ============================
export const createReservation = createAsyncThunk(
  "reservation/createReservation",
  async (data, { rejectWithValue }) => {
    try {
      // Récupérer le cookie CSRF via l'instance axios (baseURL appliqué)
      try {
        await axios.get(`/sanctum/csrf-cookie`);
      } catch (e) {
        console.error("Failed to fetch CSRF cookie:", e);
        return rejectWithValue({ message: "Impossible d'obtenir le cookie CSRF.", raw: e });
      }

      // Envoyer la réservation
      const res = await axios.post(`/api/reservations`, data);
      return res.data;
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      console.error("createReservation error:", status, data || err.message);
      const message = data?.message || (typeof data === "object" ? JSON.stringify(data) : data) || err.message;
      return rejectWithValue({ message, status, raw: data });
    }
  }
);

// ============================
// FETCH MY RESERVATIONS
// ============================
export const fetchMyReservations = createAsyncThunk(
  "reservation/fetchMyReservations",
  async (_, { rejectWithValue }) => {
    try {
      await axios.get(`/sanctum/csrf-cookie`);
      const res = await axios.get(`/api/reservations`);
      return res.data;
    } catch (err) {
      const message = err.response?.data || err.message;
      return rejectWithValue(message);
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
      await axios.get(`/sanctum/csrf-cookie`);
      const res = await axios.patch(`/api/reservations/${id}/cancel`, null);
      return res.data;
    } catch (err) {
      const message = err.response?.data || err.message;
      return rejectWithValue(message);
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
          console.error("createReservation error:", action.payload?.status, action.payload?.raw || action.payload);
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
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export default reservationSlice.reducer;
