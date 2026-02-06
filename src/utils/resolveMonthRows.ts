import type { Expense, Income, RecurringExpense, RecurringIncome } from "../../types";

export type MonthRow = {
    rowKey: string;
    id: number;
    userId: number;
    type: string;
    description: string;
    value: number;
    date: string; // YYYY-MM-DD
    source: "single" | "recurring";
    recurringId?: number; // opzionale se vuoi distinguere
};

export function resolveMonthRows<TSingle extends Expense | Income, TRec extends RecurringExpense | RecurringIncome>(
    single: TSingle[],
    recurring: TRec[],
    monthIdx0: number // 0..11
): MonthRow[] {
    const singleRows: MonthRow[] = single.map((x) => ({
        rowKey: `single-${x.id}`,
        id: x.id,
        userId: x.userId,
        type: x.type,
        description: x.description,
        value: x.value,
        date: x.date,
        source: "single",
    }));

    const monthIdx0_prev = monthIdx0 == 0 ? 11 : monthIdx0-1; 

    const recurringRows: MonthRow[] = recurring
        
        .map((r) => {
            const d = r.date?.[monthIdx0] ?? null;
            const v = r.value?.[monthIdx0] ?? null;
            if (!d || v == null) return null;

            return {
                rowKey: `recurring-${r.id}-${monthIdx0}`,
                id: r.id,
                userId: r.userId,
                type: r.type,
                description: r.description,
                value: v,
                date: d,
                source: "recurring",
                recurringId: r.id,
            } as MonthRow;
        })
        .filter((x): x is MonthRow => x !== null);

    const recurringRowsPrevMonth: MonthRow[] = recurring

        .map((r) => {
            const d = r.date?.[monthIdx0_prev] ?? null;
            const v = r.value?.[monthIdx0] ?? null;
            if (!d || v == null) return null;

            return {
                rowKey: `recurring-${r.id}-${monthIdx0}`,
                id: r.id,
                userId: r.userId,
                type: r.type,
                description: r.description,
                value: v,
                date: d,
                source: "recurring",
                recurringId: r.id,
            } as MonthRow;
        })
        .filter((x): x is MonthRow => x !== null);

    return [...singleRows, ...recurringRows, ...recurringRowsPrevMonth];
}
