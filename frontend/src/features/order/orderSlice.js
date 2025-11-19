import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  total: 0,
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrderItem(state, action) {
      state.items.push(action.payload)
    },
    clearOrder(state) {
      state.items = []
      state.total = 0
    },
    setOrderTotal(state, action) {
      state.total = action.payload
    },
  },
})

export const { addOrderItem, clearOrder, setOrderTotal } = orderSlice.actions
export default orderSlice.reducer
