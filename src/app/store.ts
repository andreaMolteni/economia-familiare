import { configureStore } from '@reduxjs/toolkit';
import { financeApi } from '../services/financeApi';
import dateReducer from "../slices/dateSlice";
import moneyReducer from "../slices/moneySlice";
import authReducer from "../feature/auth/authSlice";
import { authApi } from "../feature/auth/authApi";
import serverReducer from "../slices/serverSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        server: serverReducer,
        [financeApi.reducerPath]: financeApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        date: dateReducer,
        money: moneyReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(financeApi.middleware, authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;