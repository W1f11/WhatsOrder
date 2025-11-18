import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Thunk pour créer une réservation
export const createReservation = createAsyncThunk(
  "reservation/createReservation",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/reservations", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk pour récupérer les réservations de l’utilisateur
export const fetchMyReservations = createAsyncThunk(
  "reservation/fetchMyReservations",
  async () => {
    const res = await api.get("/reservations");
    return res.data;
  }
);

// Thunk pour annuler une réservation
export const cancelReservation = createAsyncThunk(
  "reservation/cancelReservation",
  async (id) => {
    const res = await api.patch(`/reservations/${id}/cancel`);
    return res.data;
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
