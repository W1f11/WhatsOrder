import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	items: [],
}

const orderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {
		addItem(state, action) {
			state.items.push(action.payload)
		},
		clearOrder(state) {
			state.items = []
		},
	},
})

export const { addItem, clearOrder } = orderSlice.actions
export default orderSlice.reducer
