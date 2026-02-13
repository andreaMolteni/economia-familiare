import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
    accessToken: string | null;
    lastAuthError: "unauthorized" | null;
};

const initialState: AuthState = {
    accessToken: localStorage.getItem("accessToken"),
    lastAuthError: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
            state.lastAuthError = null;
            localStorage.setItem("accessToken", action.payload);
        },
        logout(state) {
            state.accessToken = null;
            state.lastAuthError = null;
            localStorage.removeItem("accessToken");
        },
        authErrorUnauthorized(state) {
            state.lastAuthError = "unauthorized";
            state.accessToken = null;
            localStorage.removeItem("accessToken");
        }
    },
});

export const { setCredentials, logout, authErrorUnauthorized } = authSlice.actions;
export default authSlice.reducer;
