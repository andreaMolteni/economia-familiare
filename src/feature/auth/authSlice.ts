import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

type AuthState = {
    accessToken: string | null;
    lastAuthError: "unauthorized" | null;
    userName: string | null;
    roles: string[];
    exp: number | null;
};

type JwtClaims = {
    sub?: string;        // username
    roles?: string[];    // ["USER"]
    exp?: number;        // epoch seconds
};


function decode(token: string): Pick<AuthState, "userName" | "roles" | "exp"> {
    try {
        const c = jwtDecode<JwtClaims>(token);
        return {
            userName: c.sub ?? null,
            roles: Array.isArray(c.roles) ? c.roles : [],
            exp: typeof c.exp === "number" ? c.exp : null,
        };
    } catch {
        return { userName: null, roles: [], exp: null };
    }
}

const initialToken = localStorage.getItem("accessToken");
const initialDecoded = initialToken ? decode(initialToken) : { userName: null, roles: [], exp: null };


const initialState: AuthState = {
    accessToken: initialToken,
    ...initialDecoded,
    lastAuthError: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<string>) {
            const token = action.payload;
            state.accessToken = token;
            state.lastAuthError = null;
            localStorage.setItem("accessToken", token);
            const d = decode(token);
            state.userName = d.userName;
            state.roles = d.roles;
            state.exp = d.exp;
        },
        logout(state) {
            state.accessToken = null;
            state.userName = null;
            state.roles = [];
            state.exp = null;
            state.lastAuthError = null;
            localStorage.removeItem("accessToken");
        },
        authErrorUnauthorized(state) {
            state.lastAuthError = "unauthorized";
        }
    },
});

export const { setCredentials, logout, authErrorUnauthorized } = authSlice.actions;
export default authSlice.reducer;
