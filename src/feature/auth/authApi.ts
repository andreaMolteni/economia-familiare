import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type LoginRequest = {
    userName: string;
    password: string;
};

export type LoginResponse = {
    accessToken: string;
    tokenType: "Bearer" | string;
    expiresInSeconds: number;
};

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useLoginMutation } = authApi;
