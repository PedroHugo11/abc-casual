import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Address, Shipping } from "./types";

interface CheckoutState {
  addresses: Address[];
  selectedAddress: string | null;
  shippingOptions: Shipping[];
  selectedShipping: string | null;
  paymentMethod: string | null;
}

const initialState: CheckoutState = {
  addresses: [],
  selectedAddress: null,
  shippingOptions: [],
  selectedShipping: null,
  paymentMethod: null
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setAddresses(state, action: PayloadAction<Address[]>) {
      state.addresses = action.payload;
    },

    addAddress(state, action: PayloadAction<Address>) {
      state.addresses.push(action.payload);
    },

    selectAddress(state, action: PayloadAction<string>) {
      state.selectedAddress = action.payload;
    },

    setShippingOptions(state, action: PayloadAction<Shipping[]>) {
      state.shippingOptions = action.payload;
    },

    selectShipping(state, action: PayloadAction<string>) {
      state.selectedShipping = action.payload;
    },

    resetCheckout(state) {
      state.selectedAddress = null;
      state.selectedShipping = null;
    },

    selectPayment(state, action: PayloadAction<string>) {
      state.paymentMethod = action.payload
    }
  },
});

export const {
  setAddresses,
  addAddress,
  selectAddress,
  setShippingOptions,
  selectShipping,
  resetCheckout,
  selectPayment
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
