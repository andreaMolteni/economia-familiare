import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import { setCredentials, authErrorUnauthorized } from "../feature/auth/authSlice";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

// ✅ baseQuery normale: aggiunge Bearer
const authedBaseQuery = fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

// ✅ baseQuery “pulita”: NON aggiunge Bearer (serve per /auth/refresh)
const plainBaseQuery = fetchBaseQuery({
    baseUrl,
    credentials: "include",
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
    async (args, api, extraOptions) => {
        console.log("baseQueryWithReauth args:", args);
        let result = await authedBaseQuery(args, api, extraOptions);

        if (result.error?.status === 401) {
            // prova refresh (senza Authorization)
            const refreshResult = await plainBaseQuery(
                { url: "/auth/refresh", method: "POST" },
                api,
                extraOptions
            );

            if (refreshResult.data && typeof refreshResult.data === "object" && "accessToken" in refreshResult.data) {
                const newToken = (refreshResult.data as { accessToken: string }).accessToken;
                api.dispatch(setCredentials(newToken));

                // ritenta la request originale con token nuovo
                result = await authedBaseQuery(args, api, extraOptions);
            } else {
                api.dispatch(authErrorUnauthorized());
            }
        }

        return result;
    };
