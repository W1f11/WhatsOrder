import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import menuReducer from '../features/menu/menuSlice'
import orderReducer from '../features/order/orderSlice'
import cartReducer from '../features/cart/cartSlice'
import reservationReducer from '../features/reservation/reservationSlice'


export const store = configureStore({
    reducer: {
        auth: authReducer,
        menu: menuReducer,
        order: orderReducer,
        cart: cartReducer,
        reservation: reservationReducer,
    },
})