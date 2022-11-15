import { configureStore } from '@reduxjs/toolkit'
import reducers from "./reducers";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({reducer: persistedReducer});

// export an assembled wrapper
export const persistor = persistStore(store);