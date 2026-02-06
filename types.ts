export interface Recurring {
    months: number[];
    dayOfTheMonth: number | null;
}

export interface Expense {
    id: number;
    userId: number;
    type: string;
    description: string;
    value: number;
    date: string; // ISO string
}

export interface Income {
    id: number;
    userId: number;
    type: string;
    description: string;
    value: number;
    date: string;
}


export type MonthArray<T> = Array<T | null>; // length 12

export interface RecurringExpense {
    id: number;
    userId: number;
    type: string;
    description: string;
    value: MonthArray<number>;
    date: MonthArray<string>;
    months: number[];        // 1..12
    dayOfTheMonth: number;   // 1..31
}


export interface RecurringIncome {
    id: number;
    userId: number;
    type: string;
    description: string;
    value: MonthArray<number>;
    date: MonthArray<string>;
    months: number[];        // 1..12
    dayOfTheMonth: number;   // 1..31
}
