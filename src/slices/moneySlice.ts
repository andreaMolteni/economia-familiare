import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MoneyState {
    balance: number; // saldo sul conto corrente
    budget: number; // budget giornaliero
    totalExpenses: number;
    remainingExpenses: number;
    totalIncome: number;
    remainingIncome: number;
}

const initialState: MoneyState = {
    balance: 2000, // valore iniziale
    budget: 0,
    totalExpenses: 0,
    remainingExpenses: 0,
    totalIncome: 0,
    remainingIncome: 0
};

const moneySlice = createSlice({
    name: "money",
    initialState,
    reducers: {
        setBalance(state, action: PayloadAction<number>) {
            state.balance = action.payload;
        },
        setBudget(state, action: PayloadAction<number>) {
            state.budget = action.payload;
        },
        setTotalExpenses(state, action: PayloadAction<number>) {
            state.totalExpenses = action.payload;
        },
        setRemainingExpenses(state, action: PayloadAction<number>) {
            state.remainingExpenses = action.payload;
        },
        setTotalIncome(state, action: PayloadAction<number>) {
            state.totalIncome = action.payload;
        },
        setRemainingIncome(state, action: PayloadAction<number>) {
            state.remainingIncome = action.payload;
        },
    },
});

export const {
    setBalance,
    setBudget,
    setTotalExpenses,
    setRemainingExpenses,
    setTotalIncome,
    setRemainingIncome
} = moneySlice.actions;
export default moneySlice.reducer;