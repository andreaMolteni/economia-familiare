import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Paper, Box, CircularProgress } from "@mui/material";
import { useGetOverviewQuery } from "../services/financeApi";
import type { RootState } from "../app/store";
import { setTotalExpenses, setRemainingExpenses, setTotalIncome, setRemainingIncome } from "../slices/moneySlice";
import ExpensesTable from "./ExpensesTable";
import IncomeTable from "./IncomeTable";

const FinanceDashboard: React.FC = () => {
    const dispatch = useDispatch();
    const currentDate = useSelector((s: RootState) => s.date.currentDate);
    const closingDay = useSelector((s: RootState) => s.date.closingDay);

    const { data, isLoading, isFetching, isError } = useGetOverviewQuery({
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

    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        let t: number | undefined;

        if (isFetching) {
            // mostra overlay solo dopo 200ms
            t = window.setTimeout(() => setShowOverlay(true), 200);
        } else {
            // nascondi overlay in modo async (evita warning ESLint)
            t = window.setTimeout(() => setShowOverlay(false), 0);
        }

        return () => {
            if (t) window.clearTimeout(t);
        };
    }, [isFetching]);


    const loadingOverlay = showOverlay && !!data;



    if(!data && isLoading) return <Typography>Loading...</Typography>;
    if (!data && isError) return <Typography color="error">Errore caricamento</Typography>;
    if (!data) return null;

    const overview = data;


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
                <Box sx={{ position: "relative", height: "100%" }}>
                    <Paper
                        sx={{
                            p: 2,
                            height: "100%",
                            opacity: loadingOverlay ? 0.55 : 1,
                            transition: "opacity 150ms ease",
                            pointerEvents: loadingOverlay ? "none" : "auto",
                            userSelect: loadingOverlay ? "none" : "auto",  
                        }}
                    >
                        <IncomeTable rows={overview.income} totals={overview.totals} />
                    </Paper>

                    {loadingOverlay && (
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "rgba(255,255,255,0.35)",
                                zIndex: 2,
                                borderRadius: 1,
                            }}
                        >
                            <CircularProgress size={28} />
                        </Box>
                    )}
                </Box>
            </Box >

            {/* Colonna destra: Uscite */ }
            < Box sx={{ flex: 1 }}>
                <Box sx={{ position: "relative", height: "100%" }}>
                    <Paper
                        sx={{
                            p: 2,
                            height: "100%",
                            opacity: loadingOverlay ? 0.55 : 1,
                            transition: "opacity 150ms ease",
                            pointerEvents: loadingOverlay ? "none" : "auto",
                            userSelect: loadingOverlay ? "none" : "auto",  
                        }}
                    >
                        <ExpensesTable rows={overview.expenses} totals={overview.totals} />
                    </Paper>

                    {loadingOverlay && (
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "rgba(255,255,255,0.35)",
                                zIndex: 2,
                                borderRadius: 1,
                            }}
                        >
                            <CircularProgress size={28} />
                        </Box>
                    )}
                </Box>
            </Box >
        </Box >
    );
};

export default FinanceDashboard;
