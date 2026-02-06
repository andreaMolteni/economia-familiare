import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getDateYYYYMMDD } from "../utils/dateUtils"
import { shiftAccountingMonth } from "../utils/accountingMonth";

interface DateState {
    currentDate: string; // data corrente formato YYYY-MM-DD
    closingDay: number; // giorno della chiusura contabile del mese
    dayCountDown: number; // giorni rimanenti alla fine del mese contabile
    monthIndex: number; // indice del mese corrente
    month: string | null; // mese per cui vengono mostrati i dati
}

const initialState: DateState = {
    currentDate: getDateYYYYMMDD(new Date()), // valore iniziale
    closingDay: 5,
    dayCountDown: 31,
    monthIndex: 0,
    month: "gennaio"
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
        setMonthIndex(state, action: PayloadAction<number>) {
            state.monthIndex = action.payload;
        },
        setMonth(state, action: PayloadAction<string | null>) {
            state.month = action.payload;
        },
        shiftAccountingMonthBy(state, action: PayloadAction<number>) {
            state.currentDate = shiftAccountingMonth(state.currentDate, state.closingDay, action.payload);
        },
    },
});

export const { setCurrentDate, setClosingDay, setDayCountDown, setMonthIndex, setMonth, shiftAccountingMonthBy } = dateSlice.actions;
export default dateSlice.reducer;