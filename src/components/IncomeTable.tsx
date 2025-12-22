import React, { useState } from "react";
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

import {
    useGetIncomeQuery,
    useAddIncomeMutation,
    useDeleteIncomeMutation,
    useUpdateIncomeMutation,
} from "../services/financeApi";

import type { Income } from '../../types';
import { getNextAvailableDayOfMonth, stringToDate, formatYYYYMMDDtoDDMMYYYY } from '../utils/dateUtils';
import {
    filterInMonth,
    filterRecurring,
    filterRecurringOnMonth
} from '../utils/moneyUtils';
import type { RootState } from "../app/store";
import { setTotalIncome, setRemainingIncome } from "../slices/moneySlice";

const IncomeTable: React.FC = () => {
    const dispatch = useDispatch();

    const { data: income, isLoading, isError } = useGetIncomeQuery();

    const [addIncome] = useAddIncomeMutation();
    const [deleteIncome] = useDeleteIncomeMutation();
    const [updateIncome] = useUpdateIncomeMutation();

    const [form, setForm] = useState({
        type: "",
        description: "",
        value: "",
        date: "",
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        type: "",
        description: "",
        value: "",
        date: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAdd = async () => {
        if (!form.type || !form.value || !form.date) return;

        await addIncome({
            userId: 101,
            type: form.type,
            description: form.description,
            value: Number(form.value),
            date: form.date,
            recurring: { months: [], dayOfTheMonth: null },
        });

        setForm({ type: "", description: "", value: "", date: "" });
    };

    const startEdit = (row: Income) => {
        setEditingId(row.id);
        setEditForm({
            type: row.type,
            description: row.description,
            value: String(row.value),
            date: row.date,
        });
    };

    const saveEdit = async () => {
        if (!editingId) return;

        await updateIncome({
            id: editingId,
            type: editForm.type,
            description: editForm.description,
            value: Number(editForm.value),
            date: editForm.date,
            recurring: { months: [], dayOfTheMonth: null },
        });

        setEditingId(null);
    };


    const concatIncome = (inc1: Income[], inc2: Income[]) => {
        return [...inc1, ...inc2];
    }


    // data di oggi
    const currentDate = useSelector((state: RootState) => state.date.currentDate);

    const closingDay = useSelector((state: RootState) => state.date.closingDay);
    // data della chiusura del mese
    const fixedDate: Date = getNextAvailableDayOfMonth(stringToDate(currentDate), closingDay);


    const filteredRecurringIncome = filterRecurring(income ?? []);
    const filteredRecurringOnMonthIncome = filterRecurringOnMonth(filteredRecurringIncome ?? [], fixedDate);
    const inMonthIncome = filterInMonth(income ?? [], fixedDate);

    //voci di spesa totali del mese corrente
    const filteredIncome = concatIncome(filteredRecurringOnMonthIncome, inMonthIncome);



    //totali spese del mese
    const totalIncome = filteredIncome.reduce(
        (acc, exp) => acc + exp.value,
        0
    );

    dispatch(setTotalIncome(totalIncome));

    //spese ancora da pagare
    const RemainingFilteredIncome = filteredIncome.filter((exp) => stringToDate(exp.date) > stringToDate(currentDate));

    //totale da pagare
    const totalRemainingIncome = RemainingFilteredIncome.reduce(
        (acc, exp) => acc + exp.value,
        0
    );

    dispatch(setRemainingIncome(totalRemainingIncome));

    console.log("Income: ", totalIncome);
    console.log("Remaining Income: ", totalRemainingIncome);

    if (isLoading) return <Typography>Loading income...</Typography>;
    if (isError)
        return <Typography color="error">Error loading income</Typography>;

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Income
            </Typography>

            {/* Form di inserimento */}
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    mb: 2,
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                <TextField
                    label="Type"
                    name="type"
                    size="small"
                    value={form.type}
                    onChange={handleChange}
                />
                <TextField
                    label="Description"
                    name="description"
                    size="small"
                    value={form.description}
                    onChange={handleChange}
                />
                <TextField
                    label="Value"
                    name="value"
                    type="number"
                    size="small"
                    value={form.value}
                    onChange={handleChange}
                />
                <TextField
                    label="Date"
                    name="date"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={form.date}
                    onChange={handleChange}
                />

                <Button variant="contained" onClick={handleAdd}>
                    Add Income
                </Button>
            </Box>

            {/* Tabella principale */}
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
                        {filteredIncome?.map((row) => {
                            const isEditing = editingId === row.id;

                            return (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        {isEditing ? (
                                            <TextField
                                                size="small"
                                                value={editForm.type}
                                                onChange={(e) =>
                                                    setEditForm((p) => ({ ...p, type: e.target.value }))
                                                }
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
                                                    setEditForm((p) => ({
                                                        ...p,
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
                                                    setEditForm((p) => ({
                                                        ...p,
                                                        value: e.target.value,
                                                    }))
                                                }
                                            />
                                        ) : (
                                            row.value.toFixed(2)
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
                                                    setEditForm((p) => ({ ...p, date: e.target.value }))
                                                }
                                            />
                                        ) : (
                                            formatYYYYMMDDtoDDMMYYYY(row.date)
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        {isEditing ? (
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="success"
                                                onClick={saveEdit}
                                            >
                                                Save
                                            </Button>
                                        ) : (
                                            <>
                                                <IconButton onClick={() => startEdit(row)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => deleteIncome(row.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {income && income.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No income yet.
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
