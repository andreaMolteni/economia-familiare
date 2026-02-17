import React, { useEffect, useState, useMemo } from "react";
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
    Button,
    Tooltip,
    Box
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import TodayIcon from "@mui/icons-material/Today";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../app/store";
import {
    getNextAvailableDayOfMonth,
    diffInDays,
    formatYYYYMMDDtoDDMMYYYY,
    getDateYYYYMMDD,
    stringToDate,
    getMonthByIndex,
    getIndexMonthByFixedDate,
    todayISO
} from "../utils/dateUtils";
import { setDayCountDown, setMonth, setMonthIndex, shiftAccountingMonthBy, setCurrentDate, setClosingDay } from "../slices/dateSlice";
import { setBalance, setBudget } from "../slices/moneySlice";

const ResumeData: React.FC = () => {
    const dispatch = useDispatch();

    /* ======================
       REDUX STATE
    ====================== */
    const currentDate = useSelector((state: RootState) => state.date.currentDate);
    const closingDay = useSelector((state: RootState) => state.date.closingDay);
    const dayCountDown = useSelector((state: RootState) => state.date.dayCountDown);
    const month = useSelector((state: RootState) => state.date.month);
    const monthIndex = useSelector((state: RootState) => state.date.monthIndex);

    const balance = useSelector((state: RootState) => state.money.balance);
    const budget = useSelector((state: RootState) => state.money.budget);
    const remainingExpenses = useSelector(
        (state: RootState) => state.money.remainingExpenses
    );
    const remainingIncome = useSelector(
        (state: RootState) => state.money.remainingIncome
    );
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState<string>(String(closingDay));

    /* ======================
       DATE CALCULATIONS
    ====================== */
    const fixedDate = useMemo(
        () => getNextAvailableDayOfMonth(stringToDate(currentDate), closingDay),
        [currentDate, closingDay]
    );

    const closingDateLabel = useMemo(() => {
        // fixedDate è la “data di chiusura” che già calcoli
        // se vuoi usare un altro calcolo, sostituisci qui
        const y = fixedDate.getFullYear();
        const m = String(fixedDate.getMonth() + 1).padStart(2, "0");
        const d = String(fixedDate.getDate()).padStart(2, "0");
        return formatYYYYMMDDtoDDMMYYYY(`${y}-${m}-${d}`);
    }, [fixedDate]);

    const onStart = () => {
        setDraft(String(closingDay));
        setEditing(true);
    };

    const onCancel = () => {
        setDraft(String(closingDay));
        setEditing(false);
    };

    const onSave = () => {
        const n = Number(draft);
        if (!Number.isFinite(n)) return;
        const v = Math.min(31, Math.max(1, Math.trunc(n)));
        dispatch(setClosingDay(v));
        setEditing(false);
    };

    const canSave = (() => {
        const n = Number(draft);
        return Number.isFinite(n) && n >= 1 && n <= 31 && Math.trunc(n) !== closingDay;
    })();

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

        dispatch(setMonthIndex(getIndexMonthByFixedDate(fixedDate)));
        dispatch(setMonth(getMonthByIndex(monthIndex)));

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
        month,
        monthIndex
    ]);

    const userName = "Andrea";

    const goToday = () => dispatch(setCurrentDate(todayISO()));

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
                        size={{ xs: 4 }}
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
                        <Typography variant="h5" sx={{ fontWeight: 600, color: "primary.main" }}>
                            Il mese contabile si chiude il
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: "primary.main" }}>
                                {closingDateLabel}
                            </Typography>

                            {!editing ? (
                                <Tooltip title="Modifica giorno di chiusura">
                                    <IconButton size="small" onClick={onStart} sx={{ mt: 0.2 }}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <TextField
                                        size="small"
                                        value={draft}
                                        onChange={(e) => setDraft(e.target.value)}
                                        type="number"
                                        slotProps={{
                                            htmlInput: { min: 1, max: 31, style: { width: 70 } },
                                        }}
                                    />

                                    <Tooltip title="Salva">
                                        <span>
                                            <IconButton size="small" onClick={onSave} disabled={!canSave}>
                                                <CheckIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>

                                    <Tooltip title="Annulla">
                                        <IconButton size="small" onClick={onCancel}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    {/* Centro */}
                    <Grid
                        size={{ xs: 4 }}
                    >
                        <Typography
                            variant="h2"
                            sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}
                        >
                            {month}
                        </Typography>

                        {/* Pulsanti SOTTO al mese */}
                        <Stack direction="row" spacing={6} alignItems="center">
                            <IconButton
                                aria-label="Mese precedente"
                                onClick={() => dispatch(shiftAccountingMonthBy(-1))}
                                size="large"
                            >
                                <ChevronLeftIcon fontSize="large" />
                            </IconButton>
                            {/* Pulsante OGGI */}
                            <Button
                                variant="outlined"
                                startIcon={<TodayIcon />}
                                onClick={goToday}
                                sx={{ borderRadius: 999, px: 2 }}
                            >
                                Oggi
                            </Button>
                            {/*
                            <IconButton aria-label="Torna a oggi" onClick={goToday} size="large">
                                <TodayIcon fontSize="large" />
                            </IconButton>
                            */}
                            <IconButton
                                aria-label="Mese successivo"
                                onClick={() => dispatch(shiftAccountingMonthBy(+1))}
                                size="large"
                            >
                                <ChevronRightIcon fontSize="large" />
                            </IconButton>
                        </Stack>
                    </Grid>

                    {/* Destra */}
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