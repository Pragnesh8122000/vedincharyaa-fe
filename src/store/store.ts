import { configureStore } from '@reduxjs/toolkit';
import shlokReducer from './shlokSlice';

export const store = configureStore({
  reducer: {
    shlok: shlokReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
