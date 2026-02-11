import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    Expense,
    Income,
    RecurringExpense,
    RecurringIncome,
} from "../../types";
import type { OverviewResponse } from "../types/overview";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";


const BASIC_USER = import.meta.env.VITE_BASIC_USER as string | undefined;
const BASIC_PASS = import.meta.env.VITE_BASIC_PASS as string | undefined;

const basicAuthHeader = (() => {
    if (!BASIC_USER || !BASIC_PASS) return undefined;
    return `Basic ${btoa(`${BASIC_USER}:${BASIC_PASS}`)}`;
})();

type AnyObj = Record<string, unknown>;

function stripClientFields<T extends AnyObj>(payload: T) {
    // rimuove campi “solo FE” che il backend non mappa
    const { kind, userId, ...rest } = payload as AnyObj;
    return rest;
}


export const financeApi = createApi({
    reducerPath: "financeApi",
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers) => {
            if (basicAuthHeader) headers.set("Authorization", basicAuthHeader);
            return headers;
        },
    }),
    tagTypes: ["Overview", "Expenses", "Income", "RecurringExpenses", "RecurringIncome"],
    endpoints: (builder) => ({
        // ---------------- OVERVIEW (flattened) ----------------
        getOverview: builder.query<
            OverviewResponse,
            { referenceDate: string; closingDay: number }
        >({
            query: ({ referenceDate, closingDay }) =>
                `/me/overview?referenceDate=${referenceDate}&closingDay=${closingDay}`,
            providesTags: [{ type: "Overview", id: "CURRENT" }],
        }),

        // ---------------- EXPENSES (single) ----------------
        // Nuove rotte backend
        getExpenses: builder.query<Expense[], void>({
            query: () => "/me/expenses",
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((e) => ({ type: "Expenses" as const, id: e.id })),
                        { type: "Expenses" as const, id: "LIST" },
                    ]
                    : [{ type: "Expenses" as const, id: "LIST" }],
        }),
        addExpense: builder.mutation<Expense, Partial<Expense> & { kind?: string; userId?: number }>({
            query: (body) => ({
                url: "/me/expenses",
                method: "POST",
                body: stripClientFields(body as AnyObj),
            }),
            invalidatesTags: [{ type: "Overview", id: "CURRENT" }, { type: "Expenses", id: "LIST" }],
        }),
        updateExpense: builder.mutation<Expense, Partial<Expense> & Pick<Expense, "id"> & { kind?: string; userId?: number }>({
            query: ({ id, ...patch }) => ({
                url: `/me/expenses/${id}`,
                method: "PUT",
                body: stripClientFields(patch as AnyObj),
            }),
            invalidatesTags: (_r, _e, { id }) => [
                { type: "Overview", id: "CURRENT" },
                { type: "Expenses", id },
                { type: "Expenses", id: "LIST" },
            ],
        }),
        deleteExpense: builder.mutation<void, number>({
            query: (id) => ({ url: `/me/expenses/${id}`, method: "DELETE" }),
            invalidatesTags: (_r, _e, id) => [
                { type: "Overview", id: "CURRENT" },
                { type: "Expenses", id },
                { type: "Expenses", id: "LIST" },
            ],
        }),

        // ---------------- RECURRING EXPENSES ----------------
        getRecurringExpenses: builder.query<RecurringExpense[], void>({
            query: () => "/me/recurring-expenses",
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((e) => ({ type: "RecurringExpenses" as const, id: e.id })),
                        { type: "RecurringExpenses" as const, id: "LIST" },
                    ]
                    : [{ type: "RecurringExpenses" as const, id: "LIST" }],
        }),
        addRecurringExpense: builder.mutation<
            RecurringExpense,
            Partial<RecurringExpense> & { kind?: string; userId?: number }
        >({
            query: (body) => ({
                url: "/me/recurring-expenses",
                method: "POST",
                body: stripClientFields(body as AnyObj),
            }),
            invalidatesTags: [{ type: "Overview", id: "CURRENT" }, { type: "RecurringExpenses", id: "LIST" }],
        }),
        updateRecurringExpense: builder.mutation<
            RecurringExpense,
            Partial<RecurringExpense> & Pick<RecurringExpense, "id">
        >({
            query: ({ id, ...patch }) => ({
                url: `/me/recurring-expenses/${id}`,
                method: "PUT",
                body: stripClientFields(patch as AnyObj),
            }),
            invalidatesTags: (_r, _e, { id }) => [
                { type: "Overview", id: "CURRENT" },
                { type: "RecurringExpenses", id },
                { type: "RecurringExpenses", id: "LIST" },
            ],
        }),
        deleteRecurringExpense: builder.mutation<void, number>({
            query: (id) => ({ url: `/me/recurring-expenses/${id}`, method: "DELETE" }),
            invalidatesTags: (_r, _e, id) => [
                { type: "Overview", id: "CURRENT" },
                { type: "RecurringExpenses", id },
                { type: "RecurringExpenses", id: "LIST" },
            ],
        }),

        // ---------------- INCOME (single) ----------------
        getIncome: builder.query<Income[], void>({
            query: () => "/me/income",
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((i) => ({ type: "Income" as const, id: i.id })),
                        { type: "Income" as const, id: "LIST" },
                    ]
                    : [{ type: "Income" as const, id: "LIST" }],
        }),
        addIncome: builder.mutation<Income, Partial<Income> & { kind?: string; userId?: number }>({
            query: (body) => ({
                url: "/me/income",
                method: "POST",
                body: stripClientFields(body as AnyObj),
            }),
            invalidatesTags: [{ type: "Overview", id: "CURRENT" }, { type: "Income", id: "LIST" }],
        }),
        updateIncome: builder.mutation<Income, Partial<Income> & Pick<Income, "id">>({
            query: ({ id, ...patch }) => ({
                url: `/me/income/${id}`,
                method: "PUT",
                body: stripClientFields(patch as AnyObj),
            }),
            invalidatesTags: (_r, _e, { id }) => [
                { type: "Overview", id: "CURRENT" },
                { type: "Income", id },
                { type: "Income", id: "LIST" },
            ],
        }),
        deleteIncome: builder.mutation<void, number>({
            query: (id) => ({ url: `/me/income/${id}`, method: "DELETE" }),
            invalidatesTags: (_r, _e, id) => [
                { type: "Overview", id: "CURRENT" },
                { type: "Income", id },
                { type: "Income", id: "LIST" },
            ],
        }),

        // ---------------- RECURRING INCOME ----------------
        getRecurringIncome: builder.query<RecurringIncome[], void>({
            query: () => "/me/recurring-income",
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((i) => ({ type: "RecurringIncome" as const, id: i.id })),
                        { type: "RecurringIncome" as const, id: "LIST" },
                    ]
                    : [{ type: "RecurringIncome" as const, id: "LIST" }],
        }),
        addRecurringIncome: builder.mutation<
            RecurringIncome,
            Partial<RecurringIncome> & { kind?: string; userId?: number }
        >({
            query: (body) => ({
                url: "/me/recurring-income",
                method: "POST",
                body: stripClientFields(body as AnyObj),
            }),
            invalidatesTags: [{ type: "Overview", id: "CURRENT" }, { type: "RecurringIncome", id: "LIST" }],
        }),
        updateRecurringIncome: builder.mutation<
            RecurringIncome,
            Partial<RecurringIncome> & Pick<RecurringIncome, "id">
        >({
            query: ({ id, ...patch }) => ({
                url: `/me/recurring-income/${id}`,
                method: "PUT",
                body: stripClientFields(patch as AnyObj),
            }),
            invalidatesTags: (_r, _e, { id }) => [
                { type: "Overview", id: "CURRENT" },
                { type: "RecurringIncome", id },
                { type: "RecurringIncome", id: "LIST" },
            ],
        }),
        deleteRecurringIncome: builder.mutation<void, number>({
            query: (id) => ({ url: `/me/recurring-income/${id}`, method: "DELETE" }),
            invalidatesTags: (_r, _e, id) => [
                { type: "Overview", id: "CURRENT" },
                { type: "RecurringIncome", id },
                { type: "RecurringIncome", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetOverviewQuery,

    useGetExpensesQuery,
    useAddExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation,

    useGetRecurringExpensesQuery,
    useAddRecurringExpenseMutation,
    useUpdateRecurringExpenseMutation,
    useDeleteRecurringExpenseMutation,

    useGetIncomeQuery,
    useAddIncomeMutation,
    useUpdateIncomeMutation,
    useDeleteIncomeMutation,

    useGetRecurringIncomeQuery,
    useAddRecurringIncomeMutation,
    useUpdateRecurringIncomeMutation,
    useDeleteRecurringIncomeMutation,
} = financeApi;
