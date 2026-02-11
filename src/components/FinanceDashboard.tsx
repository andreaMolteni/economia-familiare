import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Paper, Box } from "@mui/material";
import { useGetOverviewQuery } from "../services/financeApi";
import type { RootState } from "../app/store";
import { setTotalExpenses, setRemainingExpenses, setTotalIncome, setRemainingIncome } from "../slices/moneySlice";
import ExpensesTable from "./ExpensesTable";
import IncomeTable from "./IncomeTable";

const FinanceDashboard: React.FC = () => {
    const dispatch = useDispatch();
    const currentDate = useSelector((s: RootState) => s.date.currentDate);
    const closingDay = useSelector((s: RootState) => s.date.closingDay);

    const { data, isLoading, isError } = useGetOverviewQuery({
        referenceDate: currentDate,
        closingDay,
    });

    useEffect(() => {
        if (!data) return;

        dispatch(setTotalExpenses(data.totals.expensesMonth));
        dispatch(setRemainingExpenses(data.totals.expensesNotExpired));
        dispatch(setTotalIncome(data.totals.incomeMonth));
        dispatch(setRemainingIncome(data.totals.incomeNotExpired));
    }, [data, dispatch]);

    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError || !data) return <Typography color="error">Errore caricamento</Typography>;

    return (
        //TABELLE AFFIANCATE FULL WIDTH
        < Box
            sx = {{
                display: "flex",
                flexDirection: { xs: "column", md: "row" }, // colonna su mobile, affiancate da md in su
                gap: 3,
                alignItems: "stretch",
                width: "100%",
            }}
        >
            {/* Colonna sinistra: Entrate */ }
            < Box sx = {{ flex: 1 }}>
                <Paper sx={{ p: 2, height: "100%" }}>
                    <IncomeTable rows={data.income} totals={data.totals} />
                </Paper>
            </Box >

            {/* Colonna destra: Uscite */ }
            < Box sx = {{ flex: 1 }}>
                <Paper sx={{ p: 2, height: "100%" }}>
                    <ExpensesTable rows={data.expenses} totals={data.totals} />
                </Paper>
            </Box >
        </Box >
    );
};

export default FinanceDashboard;
