import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserInfo = {
    id: string;
    email: string;
    nome: string;
    cognome: string;
};

type UserState = {
    info: UserInfo | null;
};

const initialState: UserState = {
    info: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo(state, action: PayloadAction<UserInfo | null>) {
            state.info = action.payload;
        },
        clearUserInfo(state) {
            state.info = null;
        },
    },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;