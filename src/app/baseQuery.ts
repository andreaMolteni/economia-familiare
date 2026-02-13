import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
import { authErrorUnauthorized, logout } from "../feature/auth/authSlice";


import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth?.accessToken;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQueryWithAuth: BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError
    > = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

        if (result.error?.status === 401) {
            api.dispatch(logout());
            api.dispatch(authErrorUnauthorized());
    }

    return result;
};