import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
import type { User }  from "../../types";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getCurrentUser: builder.query<User, void>({
            query: () => "/me",
            providesTags: ["User"],
        }),
    }),
});

export const { useGetCurrentUserQuery } = userApi;