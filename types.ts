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
    recurring: Recurring;
    date: string; // ISO string
}

export interface Income {
    id: number;
    userId: number;
    type: string;
    description: string;
    value: number;
    recurring: Recurring;
    date: string;
}
