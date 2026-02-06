// src/domain/accountingMonth.ts

export type AccountingRange = {
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
};

function pad2(n: number) {
    return String(n).padStart(2, "0");
}

export function formatISO(d: Date): string {
    const y = d.getFullYear();
    const m = pad2(d.getMonth() + 1);
    const day = pad2(d.getDate());
    return `${y}-${m}-${day}`;
}

export function parseISO(iso: string): Date {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function daysInMonth(year: number, monthIndex0: number): number {
    return new Date(year, monthIndex0 + 1, 0).getDate();
}

function setDayClamped(base: Date, dayOfMonth: number): Date {
    const y = base.getFullYear();
    const m = base.getMonth();
    const dim = daysInMonth(y, m);
    const d = Math.min(Math.max(dayOfMonth, 1), dim);
    return new Date(y, m, d);
}

export function addMonthsISO(iso: string, deltaMonths: number): string {
    const d = parseISO(iso);
    const y = d.getFullYear();
    const m = d.getMonth();
    const day = d.getDate();

    const moved = new Date(y, m + deltaMonths, 1);
    const clamped = setDayClamped(moved, day);
    return formatISO(clamped);
}

export function addDaysISO(iso: string, deltaDays: number): string {
    const d = parseISO(iso);
    d.setDate(d.getDate() + deltaDays);
    return formatISO(d);
}

/**
 * Regola coerente con il tuo esempio:
 * - se day(currentDate) > closingDay -> end = closingDay del mese SUCCESSIVO
 * - altrimenti end = closingDay del mese CORRENTE
 * start = (end - 1 mese) + 1 giorno
 */
export function getAccountingMonthRange(currentDateISO: string, closingDay: number): AccountingRange {
    const current = parseISO(currentDateISO);
    const day = current.getDate();

    const baseEndMonth = new Date(current.getFullYear(), current.getMonth(), 1);
    const endMonth = day > closingDay ? new Date(baseEndMonth.getFullYear(), baseEndMonth.getMonth() + 1, 1) : baseEndMonth;
    const end = setDayClamped(endMonth, closingDay);

    const endISO = formatISO(end);
    const prevEndISO = addMonthsISO(endISO, -1);
    const startISO = addDaysISO(prevEndISO, 1);

    return { start: startISO, end: endISO };
}

/**
 * Sposta il "mese contabile" di delta mesi (±1, ±2, ...)
 * e riallinea currentDate allo START del nuovo mese contabile.
 */
export function shiftAccountingMonth(currentDateISO: string, closingDay: number, deltaMonths: number): string {
    const { end } = getAccountingMonthRange(currentDateISO, closingDay);
    const newEndISO = addMonthsISO(end, deltaMonths);
    const prevEndISO = addMonthsISO(newEndISO, -1);
    const newStartISO = addDaysISO(prevEndISO, 1);
    return newStartISO;
}
