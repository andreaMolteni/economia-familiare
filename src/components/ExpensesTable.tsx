import React, { useState } from 'react';
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

const ExpensesTable: React.FC = () => {
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

    const startEdit = (exp: any) => {
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
                        {expenses?.map((exp) => {
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
