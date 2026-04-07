'use client'

import { Provider } from 'react-redux'
import { store } from './store'
import { useEffect } from 'react'

export function ReduxProvider({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const saved = localStorage.getItem('app_state')

    if (saved) {
      store.dispatch({
        type: 'HYDRATE_STATE',
        payload: JSON.parse(saved),
      })
    }
  }, [])

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState()

      localStorage.setItem(
        'app_state',
        JSON.stringify({
          auth: state.auth,
          orders: state.orders,
          cart: state.cart,
          checkout: state.checkout,
          addresses: state.addresses,
          products: state.products,
        })
      )
    })

    return () => unsubscribe()
  }, [])

  return <Provider store={store}>{children}</Provider>
}