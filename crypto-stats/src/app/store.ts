import { configureStore } from '@reduxjs/toolkit';
import { cryptoApi } from '../services/cryptoApi';
const store = configureStore({
  reducer: { [cryptoApi.reducerPath]: cryptoApi.reducer },
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
