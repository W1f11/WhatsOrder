import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const ROOT = import.meta.env.VITE_API_URL;

// Fonction pour récupérer le CSRF token
const fetchCsrfToken = async () => {
  try {
    await api.get(`${ROOT}/sanctum/csrf-cookie`, { withCredentials: true });
  } catch (err) {
    console.error('CSRF token fetch failed:', err);
  }
};

// Thunk pour créer une réservation
export const createReservation = createAsyncThunk(
  "reservation/createReservation",
  async (data, { rejectWithValue }) => {
    try {
      await fetchCsrfToken();
      const res = await api.post("/reservations", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Thunk pour récupérer les réservations de l'utilisateur
export const fetchMyReservations = createAsyncThunk(
  "reservation/fetchMyReservations",
  async (_, { rejectWithValue }) => {
    try {
      await fetchCsrfToken();
      const res = await api.get("/reservations");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Thunk pour annuler une réservation
export const cancelReservation = createAsyncThunk(
  "reservation/cancelReservation",
  async (id, { rejectWithValue }) => {
    try {
      await fetchCsrfToken();
      const res = await api.patch(`/reservations/${id}/cancel`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

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
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur création réservation";
      })

      // FETCH
      .addCase(fetchMyReservations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyReservations.rejected, (state) => {
        state.loading = false;
        state.error = "Erreur récupération réservations";
      })

      // CANCEL
      .addCase(cancelReservation.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload; // statut mis à jour
        }
      });
  }
});

export default reservationSlice.reducer;
