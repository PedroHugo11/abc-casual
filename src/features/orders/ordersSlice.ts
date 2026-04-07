import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Order } from "./types";

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    createOrder(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
    },

    updateOrderStatus(
      state,
      action: PayloadAction<{ id: string; status: Order["status"] }>,
    ) {
      const order = state.orders.find((o) => o.id === action.payload.id);

      if (order) {
        order.status = action.payload.status;
      }
    },

    updateTracking(
      state,
      action: PayloadAction<{ id: string; tracking: string }>,
    ) {
      const order = state.orders.find((o) => o.id === action.payload.id);

      if (order) {
        order.tracking = action.payload.tracking;
      }
    },
  },
});

export const { createOrder, updateOrderStatus, updateTracking } = ordersSlice.actions;

export default ordersSlice.reducer;
