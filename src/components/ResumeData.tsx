import React, { useEffect, useState } from "react";
import {
    Typography,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    TextField,
    Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../app/store";
import {
    getNextAvailableDayOfMonth,
    diffInDays,
    formatYYYYMMDDtoDDMMYYYY,
    getDateDDMMYYYY,
    getDateYYYYMMDD,
    stringToDate,
} from "../utils/dateUtils";

import { setDayCountDown } from "../slices/dateSlice";
import { setBalance, setBudget } from "../slices/moneySlice";

const ResumeData: React.FC = () => {
    const dispatch = useDispatch();

    /* ======================
       REDUX STATE
    ====================== */
    const currentDate = useSelector((state: RootState) => state.date.currentDate);
    const closingDay = useSelector((state: RootState) => state.date.closingDay);
    const dayCountDown = useSelector((state: RootState) => state.date.dayCountDown);

    const balance = useSelector((state: RootState) => state.money.balance);
    const budget = useSelector((state: RootState) => state.money.budget);
    const remainingExpenses = useSelector(
        (state: RootState) => state.money.remainingExpenses
    );
    const remainingIncome = useSelector(
        (state: RootState) => state.money.remainingIncome
    );

    /* ======================
       DATE CALCULATIONS
    ====================== */
    const fixedDate: Date = getNextAvailableDayOfMonth(
        stringToDate(currentDate),
        closingDay
    );

    /* ======================
       LOCAL STATE (EDIT BALANCE)
    ====================== */
    const [isEditingBalance, setIsEditingBalance] = useState(false);
    const [balanceDraft, setBalanceDraft] = useState(balance.toFixed(2));

    /* ======================
       BUDGET CALCULATION
    ====================== */
    const calculateBudget = (
        remainingIncome: number,
        remainingExpenses: number,
        balance: number,
        remainingDay: number
    ): number => {
        return (remainingIncome + balance - remainingExpenses) / remainingDay;
    };

    /* ======================
       SIDE EFFECTS
    ====================== */
    useEffect(() => {
        const days = diffInDays(
            stringToDate(getDateYYYYMMDD(fixedDate)),
            stringToDate(currentDate)
        );

        dispatch(setDayCountDown(days));

        const safeDays = Math.max(days, 1);
        const newBudget = calculateBudget(
            remainingIncome,
            remainingExpenses,
            balance,
            safeDays
        );

        dispatch(setBudget(newBudget));
    }, [
        dispatch,
        currentDate,
        fixedDate,
        remainingIncome,
        remainingExpenses,
        balance,
    ]);

    const userName = "Andrea";

    return (
        <div>
            {/* BOX RIEPILOGO SUPERIORE */}
            <Paper
                sx={{
                    borderRadius: 4,
                    border: "2px solid",
                    borderColor: "primary.main",
                    p: 2,
                    mb: 2,
                }}
            >
                <Grid container spacing={2}>
                    {/* Sinistra */}
                    <Grid
                        size={{ xs: 8 }}
                    >
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}
                        >
                            Ciao {userName}
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}
                        >
                            Oggi è il {formatYYYYMMDDtoDDMMYYYY(currentDate)}
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 600, color: "primary.main" }}
                        >
                            Il mese contabile si chiude il  <br /> {getDateDDMMYYYY(fixedDate)}
                        </Typography>
                    </Grid>

                    {/* Centro */}
                    <Grid
                        size={{ xs: 4 }}
                    >
                        <Paper elevation={5}
                            sx={{
                                elevation: 12,
                                borderRadius: 2,
                                border: "2px solid",
                                borderColor: "primary.main",
                                p: 1,
                                mb: 2,
                            }}
                        >
                            <List sx={{ width: '100%', hight: '100%', bgcolor: 'background.paper' }}>
                                <ListItem alignItems="flex-start">
                                    <ListItemText>
                                        <Typography
                                            component="span"
                                            sx={{ color: 'text.primary', display: 'inline' }}
                                        />
                                        Mancano <b>{dayCountDown}</b> giorni alla chiusura del mese contabile
                                    </ListItemText>
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemText>
                                        <Typography
                                            component="span"
                                            sx={{ color: 'text.primary', display: 'inline' }}
                                        />
                                        Il saldo disponibile sul tuo conto è{" "}
                                        {!isEditingBalance ? (
                                            <>
                                                <b>{balance.toFixed(2)} €</b>
                                                <IconButton
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                    onClick={() => {
                                                        setBalanceDraft(balance.toFixed(2));
                                                        setIsEditingBalance(true);
                                                    }}
                                                    aria-label="Modifica saldo"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <Stack direction="row" spacing={1} sx={{ display: "inline-flex", ml: 1 }} alignItems="center">
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={balanceDraft}
                                                    onChange={(e) => setBalanceDraft(e.target.value)}
                                                    inputProps={{ step: "0.01" }}
                                                    sx={{ width: 120 }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    color="success"
                                                    aria-label="Salva saldo"
                                                    onClick={() => {
                                                        const v = Number(balanceDraft);
                                                        if (!Number.isFinite(v)) return;
                                                        dispatch(setBalance(v));
                                                        setIsEditingBalance(false);
                                                    }}
                                                >
                                                    <CheckIcon fontSize="small" />
                                                </IconButton>

                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    aria-label="Annulla"
                                                    onClick={() => {
                                                        setBalanceDraft(balance.toFixed(2));
                                                        setIsEditingBalance(false);
                                                    }}
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        )}
                                    </ListItemText>
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemText>
                                        <Typography
                                            component="span"
                                            sx={{ color: 'text.primary', display: 'inline' }}
                                        />
                                        Il tuo budget giornaliero è di <b>{budget.toFixed(2)} €</b>
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </div>
        );

};

export default ResumeData;