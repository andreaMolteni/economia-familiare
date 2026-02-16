import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ServerState = {
    warmingUp: boolean;
    message: string | null;
};

const initialState: ServerState = {
    warmingUp: false,
    message: null,
};

const serverSlice = createSlice({
    name: "server",
    initialState,
    reducers: {
        setWarmingUp(state, action: PayloadAction<{ warmingUp: boolean; message?: string }>) {
            state.warmingUp = action.payload.warmingUp;
            state.message = action.payload.warmingUp ? (action.payload.message ?? "Server in riavvio…") : null;
        },
    },
});

export const { setWarmingUp } = serverSlice.actions;
export default serverSlice.reducer;