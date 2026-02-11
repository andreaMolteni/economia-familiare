export interface Recurring {
    months: number[];
    dayOfTheMonth: number | null;
}

export interface Expense {
    id: number;
    userId: number;
    type: string;
    description: string;
    amount: number;
    date: string; // ISO string
}

export type InitialValues =
    | {
        kind: "single";
        type: string;
        description: string;
        amount: number;
        date: string;
    }
    | {
        kind: "recurring";
        type: string;
        description: string;
        dayOfTheMonth: number;
        months: number[];
        amount: Array<number | null>;
        date: Array<string | null>;
        currentMonthAmount?: number | null;
        currentMonthDate?: string | null;
    };

export interface Income {
    id: number;
    userId: number;
    type: string;
    description: string;
    amount: number;
    date: string;
}


export type MonthArray<T> = Array<T | null>; // length 12

export interface RecurringExpense {
    id: number;
    userId: number;
    type: string;
    description: string;
    amount: MonthArray<number>;
    date: MonthArray<string>;
    months: number[];        // 1..12
    dayOfTheMonth: number;   // 1..31
}


export interface RecurringIncome {
    id: number;
    userId: number;
    type: string;
    description: string;
    amount: MonthArray<number>;
    date: MonthArray<string>;
    months: number[];        // 1..12
    dayOfTheMonth: number;   // 1..31
}
