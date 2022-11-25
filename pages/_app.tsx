import '../styles/globals.css'
import React from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from "../store";
import { PersistGate } from 'redux-persist/integration/react';
import ProtectedRoutes from '../src/components/Route/protectedRoute';
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <Provider store={store}> {/* perguntar por cima */}
      <PersistGate loading={null} persistor={persistor}>
      <ProtectedRoutes router={router}>
        <Component {...pageProps} />
        </ProtectedRoutes>
      </PersistGate>
    </Provider>
  )
}

export default MyApp;