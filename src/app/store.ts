import { configureStore } from '@reduxjs/toolkit';
import { financeApi } from '../services/financeApi';
import dateReducer from "../slices/dateSlice";

export const store = configureStore({
    reducer: {
        [financeApi.reducerPath]: financeApi.reducer,
        date: dateReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(financeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;