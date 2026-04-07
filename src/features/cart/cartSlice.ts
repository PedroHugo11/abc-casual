import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "./cartTypes";
import type { RootState } from "@/store/store";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item.product.id === action.payload.product.id &&
          item.selectedSize === action.payload.selectedSize &&
          item.selectedColor === action.payload.selectedColor,
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items.splice(action.payload, 1);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ index: number; quantity: number }>,
    ) => {
      const { index, quantity } = action.payload;

      if (quantity <= 0) {
        state.items.splice(index, 1);
        return;
      }

      state.items[index].quantity = quantity;
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;

export default cartSlice.reducer;
