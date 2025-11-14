import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import menuReducer from '../features/menu/menuSlice'
import orderReducer from '../features/order/orderSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        menu: menuReducer,
        order: orderReducer,
    },
})