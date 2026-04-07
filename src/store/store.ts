import { configureStore, combineReducers } from '@reduxjs/toolkit'

import productsReducer from '@/features/products/productsSlice'
import cartReducer from '@/features/cart/cartSlice'
import checkoutReducer from "@/features/checkout/checkoutSlice"
import authReducer from "@/features/auth/authSlice";
import ordersReducer from "@/features/orders/ordersSlice";
import addressesReducer from "@/features/addresses/addressesSlice";

const appReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  auth: authReducer,
  orders: ordersReducer,
  addresses: addressesReducer,
})

const rootReducer = (state: any, action: any) => {
  if (action.type === 'HYDRATE_STATE') {
    return {
      ...state,
      ...action.payload,
    }
  }

  return appReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch