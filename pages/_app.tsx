import '../styles/globals.css'
import React from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from "../store";
import { PersistGate } from 'redux-persist/integration/react';
import ProtectedRoutes from '../src/components/Route/protectedRoute';
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <Provider store={store}> {/* perguntar por cima */}
      <PersistGate loading={null} persistor={persistor}>
      <ProtectedRoutes router={router}>
        <Component {...pageProps} />
        </ProtectedRoutes>
        <ToastContainer position="bottom-right"/>
      </PersistGate>
    </Provider>
  )
}

export default MyApp;