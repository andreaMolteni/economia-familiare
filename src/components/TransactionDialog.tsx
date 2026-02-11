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
    Divider,
    ListItemText,
} from "@mui/material";
import type { InitialValues } from "../../types";

type Mode = "expense" | "income";

// ---------- Types per submit ----------
export type SingleExpensePayload = {
    userId: number;
    type: string;
    description: string;
    amount: number;
    date: string; // YYYY-MM-DD
};

export type RecurringExpensePayload = {
    userId: number;
    type: string;
    description: string;
    amount: Array<number | null>; // 12
    date: Array<string | null>; // 12
    months: number[]; // 1..12
    dayOfTheMonth: number; // 1..31
};

export type ExpenseSubmitPayload =
    | ({ kind: "single" } & SingleExpensePayload)
    | ({ kind: "recurring" } & RecurringExpensePayload);

export type SingleIncomePayload = SingleExpensePayload;
export type RecurringIncomePayload = RecurringExpensePayload;

export type IncomeSubmitPayload =
    | ({ kind: "single" } & SingleIncomePayload)
    | ({ kind: "recurring" } & RecurringIncomePayload);

export type SubmitPayload = ExpenseSubmitPayload | IncomeSubmitPayload;

export type RecurringEditSingleMonth = {
    recurringId: number;
    monthIndex: number; // 0..11
    originalAmount: Array<number | null>;
    originalDate: Array<string | null>;
    originalMonths: number[];
    originalDayOfTheMonth: number;
};

type Props = {
    open: boolean;
    mode: Mode;
    onClose: () => void;
    onSubmit: (payload: SubmitPayload) => Promise<void> | void;

    initial?: InitialValues | null;
    titleOverride?: string;

    // se presente -> edit recurring SOLO quel mese
    recurringEdit?: RecurringEditSingleMonth | null;
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
    const last = new Date(year, month1to12, 0).getDate();
    return Math.min(Math.max(day, 1), last);
};

const TransactionDialog: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
    mode,
    initial,
    titleOverride,
    recurringEdit,
}) => {
    const defaultTitle = mode === "expense" ? "Nuova spesa" : "Nuova entrata";
    const title = titleOverride ?? defaultTitle;

    // ✅ Se sto editando una recurring per singolo mese, la UI deve comportarsi come "single"
    const forceSingleUI = !!recurringEdit;

    // --- valori iniziali (usati SOLO al mount; quindi useremo key=... nel parent) ---
    const initialType = initial?.type ?? "";
    const initialDescription = initial?.description ?? "";

    const initialIsRecurring = initial?.kind === "recurring";
    const initialValueStr =
        initial?.kind === "single"
            ? String(initial.amount ?? "")
            : initial?.kind === "recurring" && initial.currentMonthAmount != null
                ? String(initial.currentMonthAmount)
                : "";

    const initialDate =
        initial?.kind === "single"
            ? initial.date ?? ""
            : initial?.kind === "recurring"
                ? initial.currentMonthDate ?? ""
                : "";

    const initialDay =
        initial?.kind === "recurring" ? initial.dayOfTheMonth ?? 1 : 1;

    const initialMonths =
        initial?.kind === "recurring"
            ? (initial.months ?? []).slice().sort((a, b) => a - b)
            : [];

    // --- state form ---
    const [type, setType] = useState(initialType);
    const [description, setDescription] = useState(initialDescription);
    const [valueStr, setValueStr] = useState(initialValueStr);
    const [isRecurring, setIsRecurring] = useState(initialIsRecurring);
    const [date, setDate] = useState(initialDate);

    const [dayOfTheMonth, setDayOfTheMonth] = useState<number>(initialDay);
    const [selectedMonths, setSelectedMonths] = useState<number[]>(initialMonths);

    // mesi OK/Annulla
    const [monthsOpen, setMonthsOpen] = useState(false);
    const [monthsDraft, setMonthsDraft] = useState<number[]>(initialMonths);


    const handleClose = () => {
        onClose();
    };

    // mesi picker
    const openMonths = () => {
        setMonthsDraft(selectedMonths);
        setMonthsOpen(true);
    };

    const cancelMonths = () => {
        setMonthsDraft(selectedMonths);
        setMonthsOpen(false);
    };

    const confirmMonths = () => {
        const next = monthsDraft.slice().sort((a, b) => a - b);
        setSelectedMonths(next);
        setMonthsOpen(false);
    };

    const allMonths = useMemo(() => MONTHS_IT.map((m) => m.n), []);
    const activeMonths = monthsOpen ? monthsDraft : selectedMonths;
    const allSelected = activeMonths.length === allMonths.length;

    const handleToggleAll = () => {
        const next = allSelected ? [] : allMonths;
        if (monthsOpen) setMonthsDraft(next);
        else {
            setSelectedMonths(next);
            setMonthsDraft(next);
        }
    };

    // effective recurring
    const effectiveIsRecurring = !forceSingleUI && isRecurring;

    const canSubmit = useMemo(() => {
        const v = Number(valueStr);
        if (!type.trim()) return false;
        if (!Number.isFinite(v)) return false;

        // single-like (anche forceSingleUI): serve date
        if (!effectiveIsRecurring) return !!date;

        // recurring: mesi + day validi
        if (selectedMonths.length === 0) return false;
        if (dayOfTheMonth < 1 || dayOfTheMonth > 31) return false;
        return true;
    }, [type, valueStr, date, effectiveIsRecurring, selectedMonths, dayOfTheMonth]);

    const handleSubmit = async () => {
        const v = Number(valueStr);
        if (!Number.isFinite(v)) return;

        const userId = 101;

        // ✅ edit recurring SOLO mese corrente
        if (recurringEdit) {
            const idx = recurringEdit.monthIndex;

            const newAmount = recurringEdit.originalAmount.slice();
            const newDate = recurringEdit.originalDate.slice();

            newAmount[idx] = v;
            newDate[idx] = date;

            const monthNumber = idx + 1;
            const monthsSet = new Set(recurringEdit.originalMonths);
            monthsSet.add(monthNumber);

            const payload: SubmitPayload = {
                kind: "recurring",
                userId,
                type: type.trim(),
                description: description.trim(),
                amount: newAmount,
                date: newDate,
                months: Array.from(monthsSet).sort((a, b) => a - b),
                dayOfTheMonth: recurringEdit.originalDayOfTheMonth,
            };

            await onSubmit(payload);
            onClose();
            return;
        }

        // ✅ single normale
        if (!effectiveIsRecurring) {
            const payload: SubmitPayload = {
                kind: "single",
                userId,
                type: type.trim(),
                description: description.trim(),
                amount: v,
                date,
            };
            await onSubmit(payload);
            onClose();
            return;
        }

        // ✅ recurring creazione completa
        const year = new Date().getFullYear();
        const monthsSet = new Set(selectedMonths);

        const amountArr: Array<number | null> = Array(12).fill(null);
        const dateArr: Array<string | null> = Array(12).fill(null);

        for (let m = 1; m <= 12; m++) {
            if (!monthsSet.has(m)) continue;
            const safeDay = clampDayToMonth(year, m, dayOfTheMonth);
            amountArr[m - 1] = v;
            dateArr[m - 1] = `${year}-${pad2(m)}-${pad2(safeDay)}`;
        }

        const payload: SubmitPayload = {
            kind: "recurring",
            userId,
            type: type.trim(),
            description: description.trim(),
            amount: amountArr,
            date: dateArr,
            months: selectedMonths.slice().sort((a, b) => a - b),
            dayOfTheMonth,
        };

        await onSubmit(payload);
        onClose();
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

                    {!forceSingleUI && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isRecurring}
                                    onChange={(e) => setIsRecurring(e.target.checked)}
                                />
                            }
                            label="Ricorrente"
                        />
                    )}

                    {!effectiveIsRecurring ? (
                        <TextField
                            label="Data"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ "& input": { colorScheme: "light" } }}
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
                                        {activeMonths.length} selezionati
                                    </Typography>
                                </Stack>

                                <FormControl fullWidth>
                                    <InputLabel id="months-label">Mesi</InputLabel>

                                    <Select
                                        labelId="months-label"
                                        multiple
                                        open={monthsOpen}
                                        onOpen={openMonths}
                                        onClose={cancelMonths}
                                        value={monthsOpen ? monthsDraft : selectedMonths}
                                        onChange={(e) => setMonthsDraft(e.target.value as number[])}
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
                                        MenuProps={{ PaperProps: { sx: { maxHeight: 360, width: 300 } } }}
                                    >
                                        {MONTHS_IT.map((m) => (
                                            <MenuItem key={m.n} value={m.n}>
                                                <Checkbox checked={monthsDraft.includes(m.n)} size="small" />
                                                <ListItemText primary={m.label} />
                                            </MenuItem>
                                        ))}

                                        <Divider />

                                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, p: 1 }}>
                                            <Button size="small" onClick={cancelMonths}>
                                                Annulla
                                            </Button>
                                            <Button size="small" variant="contained" onClick={confirmMonths}>
                                                OK
                                            </Button>
                                        </Box>
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
