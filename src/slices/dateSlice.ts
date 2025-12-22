import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getDateYYYYMMDD } from "../utils/dateUtils"

interface DateState {
    currentDate: string; // data corrente formato YYYY-MM-DD
    closingDay: number; // giorno della chiusura contabile del mese
    dayCountDown: number; // giorni rimanenti alla fine del mese contabile
}

const initialState: DateState = {
    currentDate: "2025-12-04",//getDateYYYYMMDD(new Date), // valore iniziale
    closingDay: 14,
    dayCountDown: 31
};

const dateSlice = createSlice({
    name: "date",
    initialState,
    reducers: {
        setCurrentDate(state, action: PayloadAction<string>) {
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