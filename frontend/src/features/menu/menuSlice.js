import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	items: [],
	loading: false,
}

const menuSlice = createSlice({
	name: 'menu',
	initialState,
	reducers: {
		setMenu(state, action) {
			state.items = action.payload
		},
		setLoading(state, action) {
			state.loading = action.payload
		},
	},
})

export const { setMenu, setLoading } = menuSlice.actions
export default menuSlice.reducer
