import { createSlice } from "@reduxjs/toolkit";

// Charger depuis localStorage
const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: savedCart, // array de produits
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload; // { id, name, price, quantity? }

      // Forcer price en nombre
      const price = Number(item.price) || 0;
      const quantity = item.quantity ? Number(item.quantity) : 1;

      const exist = state.items.find((i) => i.id === item.id);

      if (exist) {
        exist.quantity += quantity;
      } else {
        state.items.push({
          ...item,
          price,
          quantity,
        });
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
        item.quantity = Number(quantity) || 1;
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
