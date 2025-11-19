import { createSlice } from '@reduxjs/toolkit'
import { fetchMenu, fetchMenuItem } from "./menuThunks";

const menuSlice = createSlice({
	name: "menu",
	initialState: {
		items: [],
		selectedItem: null,
		loading: false,
		error: null, 
		categories: [] // pour le filtre
	},

	reducers: {}, 

	extraReducers: (builder) => {
		builder
		// fetch Menu

		.addCase(fetchMenu.pending, (state) => {
			state.loading = true;
		})
		.addCase(fetchMenu.fulfilled, (state, action) => {
			state.loading = false;
			state.items = action.payload;
			state.categories = [...new Set(action.payload.map(item => item.category))];
		})
		.addCase(fetchMenu.rejected, (state) => {
			state.loading = false;
			state.error = "Erreur lors du chargement du menu";
		})


		// fetch single item

		.addCase(fetchMenuItem.pending, (state) => {
			state.loading = true;
		})
		.addCase(fetchMenuItem.fulfilled, (state, action) => {
			state.loading = false;
			state.selectedItem = action.payload;
		})
		.addCase(fetchMenuItem.rejected, (state) => {
			state.loading = false;
			state.error = "Erreur lors du chargement du plat";
		});
	}
});
export default menuSlice.reducer;
