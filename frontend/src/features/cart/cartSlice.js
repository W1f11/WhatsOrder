import { createSlice } from "@reduxjs/toolkit";
// charger depui localStorage

const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

const cartSlice = createSlice({
    name: "cart",
    initialState:{
        items: savedCart, //array de produits
    },
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload; // { id, name, price, quantity}
            const exist = state.items.find((i) => i.id === item.id);

            if(exist){
                exist.quantity += item.quantity;

            }else{
                state.items.push(item);
            }

            localStorage.setItem("cart", JSON.stringify(state.items));


        },

        removeFromCart: (state, action) => {
            state.items = state.items.filter((i) => i.id !== action.payload);
            localStorage.setItem("cart", JSON.stringify(state.items));
        },

        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find((i) => i.id === id);

            if (item) {
                item.quantity = quantity;
            }

            localStorage.setItem("cart", JSON.stringify(state.items));

        },

        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem("cart");
        },
    },
});
export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;