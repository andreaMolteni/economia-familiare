import { configureStore } from '@reduxjs/toolkit';
import { financeApi } from '../services/financeApi';
import { userApi } from '../services/userApi';
import dateReducer from "../slices/dateSlice";
import moneyReducer from "../slices/moneySlice";
import userReducer from "../slices/userSlice";
import authReducer from "../feature/auth/authSlice";
import { authApi } from "../feature/auth/authApi";
import serverReducer from "../slices/serverSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        server: serverReducer,
        user: userReducer,
        [financeApi.reducerPath]: financeApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        date: dateReducer,
        money: moneyReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(financeApi.middleware, authApi.middleware, userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;