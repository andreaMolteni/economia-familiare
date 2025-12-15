import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppState {
    currentDate: Date; // data corrente
    closingDay: number; // giorno della chiusura contabile del mese
    dayCountDown: number; // giorni rimanenti alla fine del mese contabile
}

const initialState: AppState = {
    currentDate: new Date(), // valore iniziale
    closingDay: 14,
    dayCountDown: 31
};

const dateSlice = createSlice({
    name: "date",
    initialState,
    reducers: {
        setCurrentDate(state, action: PayloadAction<Date>) {
            state.currentDate = action.payload;
        },
        setClosingDay(state, action: PayloadAction<number>) {
            state.closingDay = action.payload;
        },
        setDayCountDown(state, action: PayloadAction<number>) {
            state.dayCountDown = action.payload;
        },
    },
});

export const { setCurrentDate, setClosingDay, setDayCountDown } = dateSlice.actions;
export default dateSlice.reducer;