import React, { useState } from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";
import {
    useGetExpensesQuery,
    useAddExpenseMutation,
    useDeleteExpenseMutation,
    useUpdateExpenseMutation
} from '../services/financeApi';

import type { Expense } from '../../types';
import { getNextAvailableDayOfMonth, stringToDate } from '../utils/dateUtils';
import {
    filterInMonth,
    filterRecurring,
    filterRecurringOnMonth
} from '../utils/moneyUtils';
import type { RootState } from "../app/store";
import { setTotalExpenses, setRemainingExpenses } from "../slices/moneySlice";

const ExpensesTable: React.FC = () => {
    const dispatch = useDispatch();
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

    const [form, setForm] = useState({
        type: '',
        description: '',
        value: '',
        date: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAdd = async () => {
        if (!form.type || !form.value || !form.date) return;

        await addExpense({
            userId: 101,
            type: form.type,
            description: form.description,
            value: Number(form.value),
            date: form.date,
            recurring: { months: [], dayOfTheMonth: null },
        });

        setForm({ type: '', description: '', value: '', date: '' });
    };

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
        if (!editingId) return;

        await updateExpense({
            id: editingId,
            type: editForm.type,
            description: editForm.description,
            value: Number(editForm.value),
            date: editForm.date,
            recurring: { months: [], dayOfTheMonth: null }
        });

        setEditingId(null);
    };


    const concatExpenses = (exp1: Expense[], exp2: Expense[]) => {
        return [...exp1, ...exp2];
    }


    // data di oggi
    const currentDate = useSelector((state: RootState) => state.date.currentDate);

    const closingDay = useSelector((state: RootState) => state.date.closingDay);
    // data della chiusura del mese
    const fixedDate: Date = getNextAvailableDayOfMonth(stringToDate(currentDate), closingDay);

 
    const filteredRecurringExpenses = filterRecurring(expenses ?? []);
    const filteredRecurringOnMonthExpenses = filterRecurringOnMonth(filteredRecurringExpenses ?? [], fixedDate);
    const inMonthExpenses = filterInMonth(expenses ?? [], fixedDate);

    //voci di spesa totali del mese corrente
    const filteredExpenses = concatExpenses(filteredRecurringOnMonthExpenses, inMonthExpenses);

    

    //totali spese del mese
    const totalEspenses = filteredExpenses.reduce(
        (acc, exp) => acc + exp.value,
        0
    );

    dispatch(setTotalExpenses(totalEspenses));

    //spese ancora da pagare
    const RemainingFilteredExpenses = filteredExpenses.filter((exp) => stringToDate(exp.date) > stringToDate(currentDate));

    //totale da pagare
    const totalRemainingEspenses = RemainingFilteredExpenses.reduce(
        (acc, exp) => acc + exp.value,
        0
    );

    dispatch(setRemainingExpenses(totalRemainingEspenses));

    console.log("expeses: ", totalEspenses);
    console.log("Remaining expeses: ", totalRemainingEspenses);
    


    if (isLoading) return <Typography>Loading expenses...</Typography>;
    if (isError) return <Typography color="error">Error loading expenses</Typography>;

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Expenses
            </Typography>

            {/* Form di inserimento */}
            <Box
                sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}
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
                    size="small"
                    type="number"
                    value={form.value}
                    onChange={handleChange}
                />
                <TextField
                    label="Date"
                    name="date"
                    size="small"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={form.date}
                    onChange={handleChange}
                />
                <Button variant="contained" onClick={handleAdd}>
                    Add Expense
                </Button>
            </Box>

            {/* Tabella */}
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
                        {filteredExpenses.map((exp) => {
                            const isEditing = editingId === exp.id;
                            return (
                                <TableRow key={exp.id}>
                                    <TableCell>
                                        {isEditing ? (
                                            <TextField
                                                size="small"
                                                value={editForm.type}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
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
                                                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
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
                                                onChange={(e) => setEditForm(prev => ({ ...prev, value: e.target.value }))}
                                            />
                                        ) : (
                                            exp.value.toFixed(2)
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {isEditing ? (
                                            <TextField
                                                size="small"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={editForm.date}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                                            />
                                        ) : (
                                            exp.date
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        {isEditing ? (
                                            <Button variant="contained" color="success" size="small" onClick={saveEdit}>
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
                        {expenses && expenses.length === 0 && (
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
