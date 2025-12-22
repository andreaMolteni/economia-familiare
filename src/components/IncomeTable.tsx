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
import type { TransactionDraft } from "./TransactionDialog";

import {
    useGetIncomeQuery,
    useAddIncomeMutation,
    useDeleteIncomeMutation,
    useUpdateIncomeMutation,
} from "../services/financeApi";

import type { Income } from "../../types";
import { getNextAvailableDayOfMonth, stringToDate, formatYYYYMMDDtoDDMMYYYY } from "../utils/dateUtils";
import { filterInMonth, filterRecurring, filterRecurringOnMonth } from "../utils/moneyUtils";
import type { RootState } from "../app/store";
import { setTotalIncome, setRemainingIncome } from "../slices/moneySlice";

const IncomeTable: React.FC = () => {
    const dispatch = useDispatch();

    // ✅ HOOKS SEMPRE IN CIMA
    const [open, setOpen] = useState(false);

    const { data: income, isLoading, isError } = useGetIncomeQuery();
    const [addIncome] = useAddIncomeMutation();
    const [deleteIncome] = useDeleteIncomeMutation();
    const [updateIncome] = useUpdateIncomeMutation();

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
    const filteredIncome: Income[] = useMemo(() => {
        const recurring = filterRecurring(income ?? []);
        const recurringOnMonth = filterRecurringOnMonth(recurring, fixedDate);
        const inMonth = filterInMonth(income ?? [], fixedDate);

        return [...recurringOnMonth, ...inMonth];
    }, [income, fixedDate]);

    // ✅ calcolo totali (memo)
    const totalIncome = useMemo(() => {
        return filteredIncome.reduce((acc, inc) => acc + inc.value, 0);
    }, [filteredIncome]);

    const totalRemainingIncome = useMemo(() => {
        const remaining = filteredIncome.filter(
            (inc) => stringToDate(inc.date) > stringToDate(currentDate)
        );
        return remaining.reduce((acc, inc) => acc + inc.value, 0);
    }, [filteredIncome, currentDate]);

    // ✅ dispatch dei totali SOLO in effect (non nel render)
    useEffect(() => {
        dispatch(setTotalIncome(totalIncome));
        dispatch(setRemainingIncome(totalRemainingIncome));
    }, [dispatch, totalIncome, totalRemainingIncome]);

    const startEdit = (inc: Income) => {
        setEditingId(inc.id);
        setEditForm({
            type: inc.type,
            description: inc.description,
            value: String(inc.value),
            date: inc.date,
        });
    };

    const saveEdit = async () => {
        if (editingId === null) return;

        await updateIncome({
            id: editingId,
            type: editForm.type,
            description: editForm.description,
            value: Number(editForm.value),
            date: editForm.date,
            // ⚠️ come per expenses: qui forziamo non-ricorrente; se vuoi edit ricorrenza lo estendiamo dopo
            recurring: { months: [], dayOfTheMonth: null },
        });

        setEditingId(null);
    };

    const handleSubmit = async (payload: TransactionDraft) => {
        await addIncome(payload);
    };

    const orderedIncome = useMemo(() => {
        return [...filteredIncome].sort((a, b) => {
            // prima ordino per data desc
            const da = new Date(a.date).getTime();
            const db = new Date(b.date).getTime();
            if (db !== da) return db - da;

            // a parità di data, id desc (più nuovo sopra)
            return b.id - a.id;
        });
    }, [filteredIncome]);

    // ✅ returns condizionali DOPO gli hook
    if (isLoading) return <Typography>Loading income...</Typography>;
    if (isError) return <Typography color="error">Error loading income</Typography>;

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">Entrate</Typography>
                <Button variant="contained" onClick={() => setOpen(true)}>
                    Aggiungi Entrata
                </Button>
            </Box>

            <TransactionDialog
                open={open}
                onClose={() => setOpen(false)}
                mode="income"
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
                            <TableCell sx={{ width: 130 }}>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell sx={{ width: 110 }} align="right">Value</TableCell>
                            <TableCell sx={{ width: 110 }}>Date</TableCell>
                            <TableCell sx={{ width: 90 }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {orderedIncome.map((inc) => {
                            const isEditing = editingId === inc.id;

                            return (
                                <TableRow key={inc.id}>
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
                                            inc.type
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
                                            inc.description
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
                                                {inc.value.toLocaleString("it-IT", {
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
                                                value={ editForm.date}
                                                onChange={(e) =>
                                                    setEditForm((prev) => ({ ...prev, date: e.target.value }))
                                                }
                                            />
                                        ) : (
                                            formatYYYYMMDDtoDDMMYYYY(inc.date)
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
                                                <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                                                        <IconButton size="small" onClick={() => startEdit(inc)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                        <IconButton size="small" onClick={() => deleteIncome(inc.id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {filteredIncome.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No income yet
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default IncomeTable;
