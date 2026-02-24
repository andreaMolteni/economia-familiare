import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import { setCredentials, authErrorUnauthorized } from "../feature/auth/authSlice";
import { setWarmingUp } from "../slices/serverSlice"; 

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

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> =
    async (args, api, extraOptions) => {
        console.log("baseQueryWithReauth args:", args);

        let result;

        const maxAttempts = 4;
        // 🔥 1️⃣ Retry automatico per cold start Render
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            result = await authedBaseQuery(args, api, extraOptions);

            if (!result.error) {
                api.dispatch(setWarmingUp({ warmingUp: false }));
                break;
            }

            const status = result.error.status;

            const isColdStart =
                status === 524 ||
                status === 502 ||
                status === 503 ||
                status === "FETCH_ERROR";

            if (!isColdStart) {
                api.dispatch(setWarmingUp({ warmingUp: false }));
                break;
            }

            api.dispatch(
                setWarmingUp({
                    warmingUp: true,
                    message:
                        attempt === 1
                            ? "Il server si sta riavviando (Render free). Attendere qualche secondo..."
                            : `Server in riavvio... tentativo ${attempt}/${maxAttempts}`,
                })
            );

            await new Promise((r) =>
                setTimeout(r, Math.min(1000 * 2 ** (attempt - 1), 8000))
            );
        }

        // 🔐 2️⃣ Logica refresh JWT (INVARIATA)
        if (result?.error?.status === 401) {
            const refreshResult = await plainBaseQuery(
                { url: "/auth/refresh", method: "POST" },
                api,
                extraOptions
            );

            if (
                refreshResult.data &&
                typeof refreshResult.data === "object" &&
                "accessToken" in refreshResult.data
            ) {
                const newToken = (refreshResult.data as { accessToken: string }).accessToken;
                api.dispatch(setCredentials(newToken));

                // ritenta la request originale con token nuovo
                result = await authedBaseQuery(args, api, extraOptions);
            } else {
                api.dispatch(authErrorUnauthorized());

                if (window.location.pathname !== "/unauthorized") {
                    window.location.replace("/unauthorized");
                }
            }
        }

        return result!;
    };
