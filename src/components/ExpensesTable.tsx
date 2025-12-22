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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import TransactionDialog from "./TransactionDialog";
import type { TransactionDraft } from "./TransactionDialog";

import {
    useGetExpensesQuery,
    useAddExpenseMutation,
    useDeleteExpenseMutation,
    useUpdateExpenseMutation,
} from "../services/financeApi";

import type { Expense } from "../../types";
import { getNextAvailableDayOfMonth, stringToDate, formatYYYYMMDDtoDDMMYYYY } from "../utils/dateUtils";
import { filterInMonth, filterRecurring, filterRecurringOnMonth } from "../utils/moneyUtils";
import type { RootState } from "../app/store";
import { setTotalExpenses, setRemainingExpenses } from "../slices/moneySlice";

const ExpensesTable: React.FC = () => {
    const dispatch = useDispatch();

    // ✅ HOOKS SEMPRE IN CIMA
    const [open, setOpen] = useState(false);

    const { data: expenses, isLoading, isError } = useGetExpensesQuery();
    const [addExpense] = useAddExpenseMutation();
    const [deleteExpense] = useDeleteExpenseMutation();
    const [updateExpense] = useUpdateExpenseMutation();

    const [editingId, setEditingId] = useState<number | null>(null);
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

    // ✅ calcolo righe mese contabile (memo)
    const filteredExpenses: Expense[] = useMemo(() => {
        const recurring = filterRecurring(expenses ?? []);
        const recurringOnMonth = filterRecurringOnMonth(recurring, fixedDate);
        const inMonth = filterInMonth(expenses ?? [], fixedDate);

        // concat
        return [...recurringOnMonth, ...inMonth];
    }, [expenses, fixedDate]);

    // ✅ calcolo totali (memo)
    const totalExpenses = useMemo(() => {
        return filteredExpenses.reduce((acc, exp) => acc + exp.value, 0);
    }, [filteredExpenses]);

    const totalRemainingExpenses = useMemo(() => {
        const remaining = filteredExpenses.filter(
            (exp) => stringToDate(exp.date) > stringToDate(currentDate)
        );
        return remaining.reduce((acc, exp) => acc + exp.value, 0);
    }, [filteredExpenses, currentDate]);

    // ✅ dispatch dei totali SOLO in effect (non nel render)
    useEffect(() => {
        dispatch(setTotalExpenses(totalExpenses));
        dispatch(setRemainingExpenses(totalRemainingExpenses));
    }, [dispatch, totalExpenses, totalRemainingExpenses]);

    const startEdit = (exp: Expense) => {
        setEditingId(exp.id);
        setEditForm({
            type: exp.type,
            description: exp.description,
            value: String(exp.value),
            date: exp.date,
        });
    };

    const saveEdit = async () => {
        if (editingId === null) return;

        await updateExpense({
            id: editingId,
            type: editForm.type,
            description: editForm.description,
            value: Number(editForm.value),
            date: editForm.date,
            // ⚠️ qui stai forzando non-ricorrente: se vuoi editare anche ricorrente lo estendiamo dopo
            recurring: { months: [], dayOfTheMonth: null },
        });

        setEditingId(null);
    };

    const handleSubmit = async (payload: TransactionDraft) => {
        await addExpense(payload);
    };

    const orderedExpenses = useMemo(() => {
        return [...filteredExpenses].sort((a, b) => {
            // prima ordino per data desc
            const da = new Date(a.date).getTime();
            const db = new Date(b.date).getTime();
            if (db !== da) return db - da;

            // a parità di data, id desc (più nuovo sopra)
            return b.id - a.id;
        });
    }, [filteredExpenses]);


    // ✅ returns condizionali DOPO gli hook
    if (isLoading) return <Typography>Loading expenses...</Typography>;
    if (isError) return <Typography color="error">Error loading expenses</Typography>;

    
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
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Value</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {orderedExpenses.map((exp) => {
                            const isEditing = editingId === exp.id;

                            return (
                                <TableRow key={exp.id}>
                                    <TableCell>
                                        {isEditing ? (
                                            <TextField
                                                size="small"
                                                value={editForm.type}
                                                onChange={(e) =>
                                                    setEditForm((prev) => ({ ...prev, type: e.target.value }))
                                                }
                                            />
                                        ) : (
                                            exp.type
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
                                            exp.description
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
                                                {exp.value.toLocaleString("it-IT", {
                                                    style: "currency",
                                                    currency: "EUR",
                                                    minimumFractionDigits: 2,
                                                })}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {isEditing ? (
                                            <TextField
                                                size="small"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={editForm.date}
                                                onChange={(e) =>
                                                    setEditForm((prev) => ({ ...prev, date: e.target.value }))
                                                }
                                            />
                                        ) : (
                                                formatYYYYMMDDtoDDMMYYYY(exp.date)
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        {isEditing ? (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                onClick={saveEdit}
                                            >
                                                Salva
                                            </Button>
                                        ) : (
                                            <>
                                                <IconButton onClick={() => startEdit(exp)}>
                                                    <EditIcon />
                                                </IconButton>

                                                <IconButton onClick={() => deleteExpense(exp.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {filteredExpenses.length === 0 && (
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
