import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    TextField,
    Button,
    IconButton,
    InputAdornment
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import TransactionDialog from "./TransactionDialog";
import type { SubmitPayload } from "./TransactionDialog";

import {
    useGetExpensesQuery,
    useAddExpenseMutation,
    useDeleteExpenseMutation,
    useUpdateExpenseMutation,
    useGetRecurringExpensesQuery,
    useAddRecurringExpenseMutation,
    useUpdateRecurringExpenseMutation,
    useDeleteRecurringExpenseMutation
} from "../services/financeApi";

import type { RecurringExpense } from "../../types";
import { getNextAvailableDayOfMonth, stringToDate, formatYYYYMMDDtoDDMMYYYY, accountingMonthIdx } from "../utils/dateUtils";
//import { filterInMonth, filterRecurring, filterRecurringOnMonth } from "../utils/moneyUtils";
import { filterInMonth } from "../utils/moneyUtils";
import type { RootState } from "../app/store";
import { setTotalExpenses, setRemainingExpenses } from "../slices/moneySlice";
import { resolveMonthRows, type MonthRow } from "../utils/resolveMonthRows";

const ExpensesTable: React.FC = () => {
    const dispatch = useDispatch();

    // ✅ HOOKS SEMPRE IN CIMA
    const [open, setOpen] = useState(false);

    const { data: expenses = [], isLoading, isError } = useGetExpensesQuery();
    const { data: recurringExpenses = [],
        isLoading: isLoadingRec,
        isError: isErrorRec
    } = useGetRecurringExpensesQuery();

    // mutations single
    const [addExpense] = useAddExpenseMutation();
    const [deleteExpense] = useDeleteExpenseMutation();
    const [updateExpense] = useUpdateExpenseMutation();

    // mutations recurring
    const [addRecurringExpense] = useAddRecurringExpenseMutation();
    const [updateRecurringExpense] = useUpdateRecurringExpenseMutation();
    const [deleteRecurringExpense] = useDeleteRecurringExpenseMutation();

    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        type: "",
        description: "",
        value: "",
        date: "",
    });

    // data di oggi
    const currentDate = useSelector((state: RootState) => state.date.currentDate);
    const closingDay = useSelector((state: RootState) => state.date.closingDay);

    const fixedDate: Date = useMemo(
        () => getNextAvailableDayOfMonth(stringToDate(currentDate), closingDay),
        [currentDate, closingDay]
    );

    const monthIdx0 = accountingMonthIdx(fixedDate);

    // recupero dei dati e sistemazione delle voci di spesa
    const rows: MonthRow[] = useMemo(() => {
        const rows_temp = resolveMonthRows(expenses, recurringExpenses, monthIdx0);
        return filterInMonth(rows_temp ?? [], fixedDate)
    }, [expenses, recurringExpenses, monthIdx0, fixedDate]);


    // riordino dei dati dal più recente
    const orderedExpenses = useMemo(() => {
        return [...rows].sort((a, b) => {
            // prima ordino per data desc
            const da = new Date(a.date).getTime();
            const db = new Date(b.date).getTime();
            if (db !== da) return db - da;

            // a parità di data, id desc (più nuovo sopra)
            return b.id - a.id;
        });
    }, [rows]);


    // ✅ calcolo totali (memo)
    const totalExpenses = useMemo(() => {
        return rows.reduce((acc, exp) => acc + exp.value, 0);
    }, [rows]);

    const totalRemainingExpenses = useMemo(() => {
        const remaining = rows.filter(
            (exp) => stringToDate(exp.date) > stringToDate(currentDate)
        );
        return remaining.reduce((acc, exp) => acc + exp.value, 0);
    }, [rows, currentDate]);

    // ✅ dispatch dei totali SOLO in effect (non nel render)
    useEffect(() => {
        dispatch(setTotalExpenses(totalExpenses));
        dispatch(setRemainingExpenses(totalRemainingExpenses));
    }, [dispatch, totalExpenses, totalRemainingExpenses]);

    const startEdit = (row: MonthRow) => {
        setEditingKey(row.rowKey);
        setEditForm({
            type: row.type,
            description: row.description,
            value: String(row.value),
            date: row.date,
        });
    };


    /** helper: prende la recurring originale dato row.id */
    const findRecurringById = (id: number): RecurringExpense | undefined =>
        recurringExpenses.find((r) => r.id === id);


    /** save edit: single vs recurring */
    const saveEdit = async (row: MonthRow) => {
        const v = Number(editForm.value);
        if (!Number.isFinite(v)) return;

        if (row.source === "single") {
            await updateExpense({
                id: row.id,
                type: editForm.type,
                description: editForm.description,
                value: v,
                date: editForm.date,
                userId: row.userId,
            });
        } else {
            const original = findRecurringById(row.id);
            if (!original) return;

            const idx = monthIdx0;

            const newValue = [...original.value];
            const newDate = [...original.date];

            newValue[idx] = v;
            newDate[idx] = editForm.date;

            await updateRecurringExpense({
                id: original.id,
                userId: original.userId,
                type: editForm.type,
                description: editForm.description,
                months: original.months,
                dayOfTheMonth: original.dayOfTheMonth,
                value: newValue,
                date: newDate,
            });
        }

        setEditingKey(null);
    };

    /** delete: single vs recurring */
    const handleDelete = async (row: MonthRow) => {
        if (row.source === "single") {
            await deleteExpense(row.id);
        } else {
            await deleteRecurringExpense(row.id);
        }
    };

    /** add submit: single vs recurring (delegato al TransactionDialog) */
    const handleSubmit = async (payload: SubmitPayload) => {
        if (payload.kind === "recurring") {
            await addRecurringExpense(payload);
        } else {
            await addExpense(payload);
        }
    };

    const totalShown = useMemo(() => {
        return rows.reduce((acc, exp) => acc + exp.value, 0);
    }, [rows]);

    const currentDateObj = useMemo(() => stringToDate(currentDate), [currentDate]);

    const totalNotExpired = useMemo(() => {
        return rows
            .filter((exp) => stringToDate(exp.date) >= currentDateObj) // oggi NON scaduto
            .reduce((acc, exp) => acc + exp.value, 0);
    }, [rows, currentDateObj]);


    // ✅ returns condizionali DOPO gli hook
    if (isLoading || isLoadingRec) return <Typography>Loading expenses...</Typography>;
    if (isError || isErrorRec) return <Typography color="error">Error loading expenses</Typography>;

    
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">Spese</Typography>
                <Button variant="contained" onClick={() => setOpen(true)}>
                    Aggiungi spesa
                </Button>
            </Box>

            <TransactionDialog
                open={open}
                onClose={() => setOpen(false)}
                mode="expense"
                onSubmit={handleSubmit}
            />

            <TableContainer component={Paper}>
                <Table
                    size="small"
                    sx={{
                        tableLayout: "fixed", // rende le colonne più controllabili
                        "& .MuiTableCell-root": {
                            py: 1,              // padding verticale ridotto
                            px: 1,              // padding orizzontale ridotto
                        },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 130, minWidth: 130 }}>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell sx={{ width: 140, minWidth: 140 }} align="right">Value</TableCell>
                            <TableCell sx={{ width: 160, minWidth: 160, whiteSpace: "nowrap" }}>Date</TableCell>
                            <TableCell sx={{ width: 130, minWidth: 130, whiteSpace: "nowrap" }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {orderedExpenses.map((row) => {
                            const isEditing = editingKey === row.rowKey;
                            const expired = stringToDate(row.date) < currentDateObj;

                            return (
                                <TableRow key={row.rowKey}
                                    sx={
                                        expired
                                            ? {
                                                opacity: 0.65,
                                                "& td": { textDecoration: "line-through", textDecorationThickness: "1px" },
                                            }
                                            : undefined
                                    }
                                >
                                    <TableCell>
                                        {isEditing ? (
                                            <TextField
                                                size="small"
                                                fullWidth
                                                value={editForm.type}
                                                onChange={(e) =>
                                                    setEditForm((prev) => ({ ...prev, type: e.target.value }))
                                                }
                                                sx={{ minWidth: 110 }}
                                            />
                                        ) : (
                                                row.type
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {isEditing ? (
                                            <TextField
                                                size="small"
                                                value={editForm.description}
                                                onChange={(e) =>
                                                    setEditForm((prev) => ({
                                                        ...prev,
                                                        description: e.target.value,
                                                    }))
                                                }
                                            />
                                        ) : (
                                            row.description
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        {isEditing ? (
                                            <TextField
                                                size="small"
                                                type="number"
                                                value={editForm.value}
                                                onChange={(e) =>
                                                    setEditForm((prev) => ({ ...prev, value: e.target.value }))
                                                }
                                                slotProps={{
                                                    input: {
                                                        endAdornment: (
                                                            <InputAdornment position="end">€</InputAdornment>
                                                        ),
                                                    },
                                                }}
                                            />
                                        ) : (
                                            <Typography component="span">
                                                {row.value.toLocaleString("it-IT", {
                                                    style: "currency",
                                                    currency: "EUR",
                                                    minimumFractionDigits: 2,
                                                })}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                                        {isEditing ? (
                                            <TextField
                                                size="small"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={editForm.date}
                                                onChange={(e) =>
                                                    setEditForm((prev) => ({ ...prev, date: e.target.value }))
                                                }
                                                sx={{
                                                    // forza il browser a rendere i controlli nativi coerenti col tema
                                                    "& input": { colorScheme: "light" }, // oppure "dark" se hai tema scuro
                                                }}
                                            />
                                        ) : (
                                                formatYYYYMMDDtoDDMMYYYY(row.date)
                                        )}
                                    </TableCell>

                                    <TableCell align="center"> 
                                        {isEditing ? (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                onClick={() => saveEdit(row)}
                                            >
                                                Salva
                                            </Button>
                                        ) : (
                                            <>
                                                <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                                                    <IconButton size="small" onClick={() => startEdit(row)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                        <IconButton size="small" onClick={() => handleDelete(row)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        <TableRow>
                            <TableCell colSpan={2} />
                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                                Totale:
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                                {totalShown.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                            </TableCell>
                            <TableCell />
                        </TableRow>

                        <TableRow>
                            <TableCell colSpan={2} />
                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                                Totale non scaduto:
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                                {totalNotExpired.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                            </TableCell>
                            <TableCell />
                        </TableRow>

                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No expenses yet
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ExpensesTable;
