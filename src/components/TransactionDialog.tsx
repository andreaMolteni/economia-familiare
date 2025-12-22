import React, { useMemo, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    FormControlLabel,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemText,
} from "@mui/material";
import { clampDayToMonth, toYYYYMMDD } from "../utils/dateUtils";

type Mode = "income" | "expense";

type Recurring = {
    months: number[];
    dayOfTheMonth: number | null;
};

export type TransactionDraft = {
    userId: number;
    type: string;
    description: string;
    value: number;
    date: string; // YYYY-MM-DD
    recurring: Recurring;
};

type Props = {
    open: boolean;
    onClose: () => void;
    mode: Mode;
    onSubmit: (payload: TransactionDraft) => Promise<void> | void;
    userId?: number;
};

const MONTHS = [
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

function getTodayYYYYMMDD(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export default function TransactionDialog({
    open,
    onClose,
    mode,
    onSubmit,
    userId = 101,
}: Props) {
    const title = mode === "income" ? "Nuova entrata" : "Nuova uscita";

    const today = useMemo(() => new Date(), []);
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1..12

    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [value, setValue] = useState<string>("");

    const [isRecurring, setIsRecurring] = useState(false);

    // non ricorrente
    const [date, setDate] = useState(getTodayYYYYMMDD());

    // ricorrente
    const [dayOfMonth, setDayOfMonth] = useState<string>("1");
    const [months, setMonths] = useState<number[]>([]);

    const allSelected = months.length === 12;

    const reset = () => {
        setType("");
        setDescription("");
        setValue("");
        setIsRecurring(false);
        setDate(getTodayYYYYMMDD());
        setDayOfMonth("1");
        setMonths([]);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleToggleAll = (checked: boolean) => {
        setMonths(checked ? MONTHS.map((m) => m.n) : []);
    };

    const handleSubmit = async () => {
        const v = Number(value);
        if (!type.trim() || !Number.isFinite(v)) return;

        if (!isRecurring) {
            const payload: TransactionDraft = {
                userId,
                type: type.trim(),
                description: description.trim(),
                value: v,
                date, // scelta utente
                recurring: { months: [], dayOfTheMonth: null },
            };
            await onSubmit(payload);
            handleClose();
            return;
        }

        // ricorrente: months non vuoto + day valido 1..31
        const dayNum = Math.max(1, Math.min(31, Number(dayOfMonth)));
        const selectedMonths = [...months].sort((a, b) => a - b);
        if (selectedMonths.length === 0) return;

        // data deve essere anno e mese corrente + giorno scelto (clamp su mesi corti)
        const safeDay = clampDayToMonth(currentYear, currentMonth, dayNum);
        const recurringDate = toYYYYMMDD(currentYear, currentMonth, safeDay);

        const payload: TransactionDraft = {
            userId,
            type: type.trim(),
            description: description.trim(),
            value: v,
            date: recurringDate,
            recurring: {
                months: selectedMonths,
                dayOfTheMonth: dayNum,
            },
        };

        await onSubmit(payload);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{title}</DialogTitle>

            <DialogContent dividers>
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
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        fullWidth
                        inputProps={{ step: "0.01" }}
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
                                label="Ricorre il giorno (1..31)"
                                type="number"
                                value={dayOfMonth}
                                onChange={(e) => setDayOfMonth(e.target.value)}
                                inputProps={{ min: 1, max: 31 }}
                                fullWidth
                            />

                            <FormControl fullWidth>
                                <InputLabel id="months-label">Scegli i mesi</InputLabel>
                                    <Select
                                        labelId="months-label"
                                        label="Scegli i mesi"
                                        multiple
                                        value={months}
                                        renderValue={(selected) =>
                                            selected.length === 12
                                                ? "Tutti"
                                                : selected
                                                    .slice()
                                                    .sort((a, b) => a - b)
                                                    .map((n) => MONTHS.find((m) => m.n === n)?.label)
                                                    .filter(Boolean)
                                                    .join(", ")
                                        }
                                        onChange={(e) => {
                                            const val = e.target.value as number[];

                                            // ✅ se clicco "All" (sentinella 0), toggle tutti e stop
                                            if (val.includes(0)) {
                                                handleToggleAll(!allSelected);
                                                return;
                                            }

                                            // ✅ protezione: rimuove eventuale 0 se arrivasse comunque
                                            setMonths(val.filter((x) => x !== 0));
                                        }}
                                    >
                                        {/* ALL */}
                                        <MenuItem value={0}>
                                            <Checkbox checked={allSelected} />
                                            <ListItemText primary="All" />
                                        </MenuItem>

                                        {MONTHS.map((m) => (
                                            <MenuItem key={m.n} value={m.n}>
                                                <Checkbox checked={months.includes(m.n)} />
                                                <ListItemText primary={m.label} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                            </FormControl>
                        </>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Annulla</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Salva
                </Button>
            </DialogActions>
        </Dialog>
    );
}
