// src/components/TransactionDialog.tsx
import React, { useMemo, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Chip,
    Box,
    Typography,
} from "@mui/material";

type Mode = "expense" | "income";

// ---------- Types per submit (NO any) ----------
export type SingleExpensePayload = {
    userId: number;
    type: string;
    description: string;
    value: number;
    date: string; // YYYY-MM-DD
};

export type RecurringExpensePayload = {
    userId: number;
    type: string;
    description: string;
    value: Array<number | null>; // 12
    date: Array<string | null>; // 12
    months: number[]; // 1..12
    dayOfTheMonth: number; // 1..31
};

export type ExpenseSubmitPayload =
    | ({ kind: "single" } & SingleExpensePayload)
    | ({ kind: "recurring" } & RecurringExpensePayload);

// income: identico payload
export type SingleIncomePayload = SingleExpensePayload;
export type RecurringIncomePayload = RecurringExpensePayload;

export type IncomeSubmitPayload =
    | ({ kind: "single" } & SingleIncomePayload)
    | ({ kind: "recurring" } & RecurringIncomePayload);

export type SubmitPayload = ExpenseSubmitPayload | IncomeSubmitPayload;

// ---------- Props ----------
type Props = {
    open: boolean;
    mode: Mode;
    onClose: () => void;
    onSubmit: (payload: SubmitPayload) => Promise<void> | void;
};

// ---------- Utils ----------
const MONTHS_IT = [
    { n: 1, label: "Gennaio" },
    { n: 2, label: "Febbraio" },
    { n: 3, label: "Marzo" },
    { n: 4, label: "Aprile" },
    { n: 5, label: "Maggio" },
    { n: 6, label: "Giugno" },
    { n: 7, label: "Luglio" },
    { n: 8, label: "Agosto" },
    { n: 9, label: "Settembre" },
    { n: 10, label: "Ottobre" },
    { n: 11, label: "Novembre" },
    { n: 12, label: "Dicembre" },
];

const pad2 = (n: number) => String(n).padStart(2, "0");

const clampDayToMonth = (year: number, month1to12: number, day: number) => {
    // ultimo giorno del mese: new Date(year, month, 0)
    const last = new Date(year, month1to12, 0).getDate();
    return Math.min(Math.max(day, 1), last);
};

const TransactionDialog: React.FC<Props> = ({ open, onClose, onSubmit, mode }) => {
    const title = mode === "expense" ? "Nuova spesa" : "Nuova entrata";

    // form base
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [valueStr, setValueStr] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);

    // single
    const [date, setDate] = useState(""); // YYYY-MM-DD

    // recurring
    const [dayOfTheMonth, setDayOfTheMonth] = useState<number>(1);
    const [selectedMonths, setSelectedMonths] = useState<number[]>([]);

    const allSelected = useMemo(
        () => selectedMonths.length === 12,
        [selectedMonths]
    );

    const resetForm = () => {
        setType("");
        setDescription("");
        setValueStr("");
        setIsRecurring(false);
        setDate("");
        setDayOfTheMonth(1);
        setSelectedMonths([]);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleToggleAll = () => {
        setSelectedMonths(allSelected ? [] : MONTHS_IT.map((m) => m.n));
    };

    const handleMonthsChange = (vals: number[]) => {
        // Se l'utente seleziona tutti i 12, ok; se rimuove qualcuno, ok.
        // Non serve logica extra, All lo gestiamo col bottone dedicato.
        setSelectedMonths(vals);
    };

    const canSubmit = useMemo(() => {
        const v = Number(valueStr);
        if (!type.trim()) return false;
        if (!Number.isFinite(v)) return false;

        if (!isRecurring) {
            return !!date; // deve esserci una data
        }

        // ricorrente: deve avere almeno un mese e day valido
        if (selectedMonths.length === 0) return false;
        if (dayOfTheMonth < 1 || dayOfTheMonth > 31) return false;
        return true;
    }, [type, valueStr, isRecurring, date, selectedMonths, dayOfTheMonth]);

    const handleSubmit = async () => {
        const v = Number(valueStr);
        if (!Number.isFinite(v)) return;

        const userId = 101;

        if (!isRecurring) {
            const payload: SubmitPayload = {
                kind: "single",
                userId,
                type: type.trim(),
                description: description.trim(),
                value: v,
                date,
            };
            await onSubmit(payload);
            handleClose();
            return;
        }

        // recurring payload
        const year = new Date().getFullYear(); // 2026 se sei in 2026; altrimenti cambia tu con un selector
        const monthsSet = new Set(selectedMonths);

        const valueArr: Array<number | null> = Array(12).fill(null);
        const dateArr: Array<string | null> = Array(12).fill(null);

        for (let m = 1; m <= 12; m++) {
            if (!monthsSet.has(m)) continue;
            const safeDay = clampDayToMonth(year, m, dayOfTheMonth);
            valueArr[m - 1] = v;
            dateArr[m - 1] = `${year}-${pad2(m)}-${pad2(safeDay)}`;
        }

        const payload: SubmitPayload = {
            kind: "recurring",
            userId,
            type: type.trim(),
            description: description.trim(),
            value: valueArr,
            date: dateArr,
            months: selectedMonths.slice().sort((a, b) => a - b),
            dayOfTheMonth,
        };

        await onSubmit(payload);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Tipologia"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Descrizione"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        minRows={2}
                    />

                    <TextField
                        label="Valore"
                        value={valueStr}
                        onChange={(e) => setValueStr(e.target.value)}
                        type="number"
                        inputProps={{ step: "0.01" }}
                        fullWidth
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                            />
                        }
                        label="Ricorrente"
                    />

                    {!isRecurring ? (
                        <TextField
                            label="Data"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    ) : (
                        <>
                            <TextField
                                label="Ricorre il giorno"
                                type="number"
                                value={dayOfTheMonth}
                                onChange={(e) => setDayOfTheMonth(Number(e.target.value))}
                                inputProps={{ min: 1, max: 31 }}
                                fullWidth
                            />

                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Scegli i mesi
                                </Typography>

                                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                    <Button
                                        size="small"
                                        variant={allSelected ? "contained" : "outlined"}
                                        onClick={handleToggleAll}
                                    >
                                        All
                                    </Button>

                                    <Typography variant="body2" sx={{ alignSelf: "center", opacity: 0.7 }}>
                                        {selectedMonths.length} selezionati
                                    </Typography>
                                </Stack>

                                <FormControl fullWidth>
                                    <InputLabel id="months-label">Mesi</InputLabel>
                                    <Select
                                        labelId="months-label"
                                        multiple
                                        value={selectedMonths}
                                        onChange={(e) => handleMonthsChange(e.target.value as number[])}
                                        input={<OutlinedInput label="Mesi" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                {(selected as number[])
                                                    .slice()
                                                    .sort((a, b) => a - b)
                                                    .map((m) => (
                                                        <Chip
                                                            key={m}
                                                            label={MONTHS_IT.find((x) => x.n === m)?.label ?? m}
                                                            size="small"
                                                        />
                                                    ))}
                                            </Box>
                                        )}
                                    >
                                        {MONTHS_IT.map((m) => (
                                            <MenuItem key={m.n} value={m.n}>
                                                {m.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Annulla</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={!canSubmit}>
                    Salva
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TransactionDialog;
