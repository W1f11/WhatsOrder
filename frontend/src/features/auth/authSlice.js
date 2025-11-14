import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser } from './authThunks';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Fonction générique pour éviter la répétition
const handleAsync = (builder, thunk) => {
  builder
    .addCase(thunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user || null;
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error?.message;
    });
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    handleAsync(builder, loginUser);
    handleAsync(builder, registerUser);

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
    });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
