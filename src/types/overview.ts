export type FlattenedRow = {
    rowKey: string;
    source: "single" | "recurring";
    id: number;
    type: string;
    description: string;
    amount: number;
    date: string;   // YYYY-MM-DD
    expired: boolean;
    monthIndex?: number;
};

export type OverviewTotals = {
    expensesMonth: number;
    expensesNotExpired: number;
    incomeMonth: number;
    incomeNotExpired: number;
    balanceMonth: number;
    balanceNotExpired: number;
};

export type OverviewResponse = {
    periodStart: string;
    periodEnd: string;
    expenses: FlattenedRow[];
    income: FlattenedRow[];
    totals: OverviewTotals;
};
