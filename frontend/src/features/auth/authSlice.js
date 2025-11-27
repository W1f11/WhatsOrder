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
      // Normalize payload: some thunks return { user: {...} } while others may return the user directly.
      // Ensure `state.user` is always the raw user object when available.
      state.user = action.payload?.user ?? action.payload;

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

  // LOGIN — personnalisé pour gérer user et manager
  builder
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;

      const p = action.payload; // response.data

      // cas 1 : { user: {...} }
      if (p?.user) {
        state.user = p.user;
        return;
      }

      // cas 2 : { manager: {...} }
      if (p?.manager) {
        state.user = p.manager;
        return;
      }

      // fallback (au cas où)
      state.user = p;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error?.message;
    });



  // REGISTER (tu peux garder handleAsync car backend renvoie toujours user)
  handleAsync(builder, registerUser);

  // LOGOUT
  builder.addCase(logoutUser.fulfilled, (state) => {
    state.user = null;
  });
},

});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
