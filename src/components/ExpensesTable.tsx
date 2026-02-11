import React, { useMemo, useState } from "react";
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
    InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import TransactionDialog from "./TransactionDialog";
import type { SubmitPayload } from "./TransactionDialog";

import {
    useAddExpenseMutation,
    useDeleteExpenseMutation,
    useUpdateExpenseMutation,
    useGetRecurringExpensesQuery,
    useAddRecurringExpenseMutation,
    useUpdateRecurringExpenseMutation,
    useDeleteRecurringExpenseMutation,
} from "../services/financeApi";

import type { RecurringExpense, InitialValues } from "../../types";
import { formatYYYYMMDDtoDDMMYYYY } from "../utils/dateUtils";
import type { FlattenedRow, OverviewTotals } from "../types/overview";

type Props = {
    rows: FlattenedRow[];
    totals: OverviewTotals;
};

const ExpensesTable: React.FC<Props> = ({ rows, totals }) => {
    // dialog add/edit recurring
    const [open, setOpen] = useState(false);

    // recurring list only for edit prefill
    const { data: recurringExpenses = [] } = useGetRecurringExpensesQuery();

    // mutations single
    const [addExpense] = useAddExpenseMutation();
    const [deleteExpense] = useDeleteExpenseMutation();
    const [updateExpense] = useUpdateExpenseMutation();

    // mutations recurring
    const [addRecurringExpense] = useAddRecurringExpenseMutation();
    const [updateRecurringExpense] = useUpdateRecurringExpenseMutation();
    const [deleteRecurringExpense] = useDeleteRecurringExpenseMutation();

    // inline edit (solo single)
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        type: "",
        description: "",
        amount: "",
        date: "",
    });

    // supporto edit recurring mese singolo
    const [editingRecurringId, setEditingRecurringId] = useState<number | null>(null);
    const [recurringEdit, setRecurringEdit] = useState<{
        recurringId: number;
        monthIndex: number;
        originalAmount: Array<number | null>;
        originalDate: Array<string | null>;
        originalMonths: number[];
        originalDayOfTheMonth: number;
    } | null>(null);

    const [dialogInitial, setDialogInitial] = useState<InitialValues | null>(null);

    const openEditRecurringSingleMonth = (row: FlattenedRow) => {
        const original = recurringExpenses.find((r) => r.id === row.id);
        if (!original) return;

        const monthIndex = new Date(row.date).getMonth(); // 0..11

        setEditingRecurringId(original.id);
        setRecurringEdit({
            recurringId: original.id,
            monthIndex,
            originalAmount: original.amount,
            originalDate: original.date,
            originalMonths: original.months,
            originalDayOfTheMonth: original.dayOfTheMonth,
        });

        setDialogInitial({
            kind: "single",
            type: row.type,
            description: row.description,
            amount: row.amount,
            date: row.date,
        });

        setOpen(true);
    };

    const orderedRows = useMemo(() => {
        return [...rows].sort((a, b) => {
            const da = new Date(a.date).getTime();
            const db = new Date(b.date).getTime();
            if (db !== da) return db - da;
            return b.id - a.id;
        });
    }, [rows]);

    const startEdit = (row: FlattenedRow) => {
        if (row.source === "recurring") {
            openEditRecurringSingleMonth(row);
            return;
        }

        setEditingKey(row.rowKey);
        setEditForm({
            type: row.type,
            description: row.description,
            amount: String(row.amount),
            date: row.date,
        });
    };

    const cancelInlineEdit = () => {
        setEditingKey(null);
    };

    const saveInlineEdit = async (row: FlattenedRow) => {
        if (row.source !== "single") return;

        const v = Number(editForm.amount);
        if (!Number.isFinite(v)) return;

        await updateExpense({
            id: row.id,
            type: editForm.type,
            description: editForm.description,
            amount: v,
            date: editForm.date,
            // userId NON serve più lato backend (/me/..)
        });

        setEditingKey(null);
    };

    const handleDelete = async (row: FlattenedRow) => {
        if (row.source === "single") {
            await deleteExpense(row.id);
        } else {
            await deleteRecurringExpense(row.id);
        }
    };

    const monthIndexFromRowKey = (rowKey: string): number | null => {
        const parts = rowKey.split("-");
        // recurring-<id>-<monthNumber>
        if (parts.length !== 3) return null;
        if (parts[0] !== "recurring") return null;
        const monthNumber = Number(parts[2]); // 1..12
        if (!Number.isFinite(monthNumber) || monthNumber < 1 || monthNumber > 12) return null;
        return monthNumber - 1;
    };


    const startEditRecurring = (row: FlattenedRow) => {
        const original: RecurringExpense | undefined = recurringExpenses.find((r) => r.id === row.id);
        if (!original) return;

        const idx =
            row.monthIndex ?? monthIndexFromRowKey(row.rowKey);

        if (idx == null) return;

        // ✅ prefill UI: compila i campi con i valori del mese corrente
        setDialogInitial({
            kind: "recurring",
            type: original.type,
            description: original.description,
            dayOfTheMonth: original.dayOfTheMonth,
            months: original.months,
            amount: original.amount,
            date: original.date,
            currentMonthAmount: original.amount[idx],
            currentMonthDate: original.date[idx],
        });

        // ✅ info tecnica: serve a TransactionDialog per patchare solo quel mese
        setRecurringEdit({
            recurringId: original.id,
            monthIndex: idx,
            originalAmount: original.amount,
            originalDate: original.date,
            originalMonths: original.months,
            originalDayOfTheMonth: original.dayOfTheMonth,
        });

        setEditingRecurringId(original.id);
        setOpen(true);
    };

    // sovrascrivo startEdit per recurring usando la funzione sopra
    const startEditRow = (row: FlattenedRow) => {
        if (row.source === "recurring") return startEditRecurring(row);
        return startEdit(row);
    };

    const handleDialogClose = () => {
        setOpen(false);
        setEditingRecurringId(null);
        setRecurringEdit(null);
        setDialogInitial(null);
    };

    const handleDialogSubmit = async (payload: SubmitPayload) => {
        if (payload.kind === "recurring") {
            if (editingRecurringId != null) {
                await updateRecurringExpense({ id: editingRecurringId, ...payload });
            } else {
                await addRecurringExpense(payload);
            }
        } else {
            await addExpense(payload);
        }

        handleDialogClose();
    };

    const openAdd = () => {
        setEditingRecurringId(null);
        setRecurringEdit(null);
        setDialogInitial(null);
        setOpen(true);
    };



    const totalShown = totals.expensesMonth;
    const totalNotExpired = totals.expensesNotExpired;

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">Spese</Typography>
                <Button variant="contained" onClick={openAdd}>
                    Aggiungi spesa
                </Button>
            </Box>

            <TransactionDialog
                key={`${open}-${editingRecurringId ?? "new"}`}   // 👈 QUESTO
                open={open}
                onClose={handleDialogClose}
                mode="expense"
                onSubmit={handleDialogSubmit}
                titleOverride={editingRecurringId != null ? "Modifica ricorrente (solo mese corrente)" : undefined}
                initial={dialogInitial}
                recurringEdit={recurringEdit}
            />

            <TableContainer component={Paper}>
                <Table
                    size="small"
                    sx={{
                        tableLayout: "fixed",
                        "& .MuiTableCell-root": { py: 1, px: 1 },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 130, minWidth: 130 }}>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell sx={{ width: 140, minWidth: 140 }} align="right">
                                Value
                            </TableCell>
                            <TableCell sx={{ width: 160, minWidth: 160, whiteSpace: "nowrap" }}>
                                Date
                            </TableCell>
                            <TableCell sx={{ width: 130, minWidth: 130, whiteSpace: "nowrap" }} align="center">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {orderedRows.map((row) => {
                            const isEditing = editingKey === row.rowKey;
                            const expired = row.expired;

                            return (
                                <TableRow
                                    key={row.rowKey}
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
                                                onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value }))}
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
                                                onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
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
                                                value={editForm.amount}
                                                onChange={(e) => setEditForm((p) => ({ ...p, amount: e.target.value }))}
                                                slotProps={{
                                                    input: {
                                                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                                    },
                                                }}
                                            />
                                        ) : (
                                            <Typography component="span">
                                                {row.amount.toLocaleString("it-IT", {
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
                                                onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))}
                                                sx={{ "& input": { colorScheme: "light" } }}
                                            />
                                        ) : (
                                            formatYYYYMMDDtoDDMMYYYY(row.date)
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        {isEditing ? (
                                            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                                <Button variant="contained" color="success" size="small" onClick={() => saveInlineEdit(row)}>
                                                    Salva
                                                </Button>
                                                <Button variant="outlined" size="small" onClick={cancelInlineEdit}>
                                                    Annulla
                                                </Button>
                                            </Box>
                                        ) : (
                                            <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                                                <IconButton size="small" onClick={() => startEditRow(row)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleDelete(row)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
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
