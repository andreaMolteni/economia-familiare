import { configureStore } from '@reduxjs/toolkit';
import { financeApi } from '../services/financeApi';

export const store = configureStore({
    reducer: {
        [financeApi.reducerPath]: financeApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(financeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;