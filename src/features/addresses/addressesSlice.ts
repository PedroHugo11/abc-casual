import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export type Address = {
  id: string;
  name: string;
  street: string;
  number: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  default: boolean;
};

interface AddressesState {
  items: Address[];
}

const initialState: AddressesState = {
  items: []
};

const addressesSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    addAddress(state, action: PayloadAction<Address>) {
      state.items.push(action.payload);
    },

    removeAddress(state, action: PayloadAction<string>) {
      state.items = state.items.filter(a => a.id !== action.payload);
    },

    setDefaultAddress(state, action: PayloadAction<string>) {
      state.items = state.items.map(a => ({
        ...a,
        default: a.id === action.payload
      }));
    }
  }
});

export const {
  addAddress,
  removeAddress,
  setDefaultAddress
} = addressesSlice.actions;

export const selectAddresses = (state: RootState) =>
  state.addresses.items;

export default addressesSlice.reducer;