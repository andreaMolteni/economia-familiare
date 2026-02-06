import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    Expense,
    Income,
    RecurringExpense,
    RecurringIncome,
} from "../../types";

export const financeApi = createApi({
    reducerPath: "financeApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
    tagTypes: ["Expenses", "Income", "RecurringExpenses", "RecurringIncome"],
    endpoints: (builder) => ({
        // ---------------- EXPENSES (single) ----------------
        getExpenses: builder.query<Expense[], void>({
            query: () => "/expenses",
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((e) => ({ type: "Expenses" as const, id: e.id })),
                        { type: "Expenses" as const, id: "LIST" },
                    ]
                    : [{ type: "Expenses" as const, id: "LIST" }],
        }),
        addExpense: builder.mutation<Expense, Partial<Expense>>({
            query: (body) => ({ url: "/expenses", method: "POST", body }),
            invalidatesTags: [{ type: "Expenses", id: "LIST" }],
        }),
        updateExpense: builder.mutation<Expense, Partial<Expense> & Pick<Expense, "id">>({
            query: ({ id, ...patch }) => ({
                url: `/expenses/${id}`,
                method: "PUT",
                body: patch,
            }),
            invalidatesTags: (_r, _e, { id }) => [
                { type: "Expenses", id },
                { type: "Expenses", id: "LIST" },
            ],
        }),
        deleteExpense: builder.mutation<void, number>({
            query: (id) => ({ url: `/expenses/${id}`, method: "DELETE" }),
            invalidatesTags: (_r, _e, id) => [
                { type: "Expenses", id },
                { type: "Expenses", id: "LIST" },
            ],
        }),

        // ---------------- RECURRING EXPENSES ----------------
        getRecurringExpenses: builder.query<RecurringExpense[], void>({
            query: () => "/recurringExpenses",
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((e) => ({ type: "RecurringExpenses" as const, id: e.id })),
                        { type: "RecurringExpenses" as const, id: "LIST" },
                    ]
                    : [{ type: "RecurringExpenses" as const, id: "LIST" }],
        }),
        addRecurringExpense: builder.mutation<RecurringExpense, Partial<RecurringExpense>>({
            query: (body) => ({ url: "/recurringExpenses", method: "POST", body }),
            invalidatesTags: [{ type: "RecurringExpenses", id: "LIST" }],
        }),
        updateRecurringExpense: builder.mutation<
            RecurringExpense,
            Partial<RecurringExpense> & Pick<RecurringExpense, "id">
        >({
            query: ({ id, ...patch }) => ({
                url: `/recurringExpenses/${id}`,
                method: "PUT",
                body: patch,
            }),
            invalidatesTags: (_r, _e, { id }) => [
                { type: "RecurringExpenses", id },
                { type: "RecurringExpenses", id: "LIST" },
            ],
        }),
        deleteRecurringExpense: builder.mutation<void, number>({
            query: (id) => ({ url: `/recurringExpenses/${id}`, method: "DELETE" }),
            invalidatesTags: (_r, _e, id) => [
                { type: "RecurringExpenses", id },
                { type: "RecurringExpenses", id: "LIST" },
            ],
        }),

        // ---------------- INCOME (single) ----------------
        getIncome: builder.query<Income[], void>({
            query: () => "/income",
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((i) => ({ type: "Income" as const, id: i.id })),
                        { type: "Income" as const, id: "LIST" },
                    ]
                    : [{ type: "Income" as const, id: "LIST" }],
        }),
        addIncome: builder.mutation<Income, Partial<Income>>({
            query: (body) => ({ url: "/income", method: "POST", body }),
            invalidatesTags: [{ type: "Income", id: "LIST" }],
        }),
        updateIncome: builder.mutation<Income, Partial<Income> & Pick<Income, "id">>({
            query: ({ id, ...patch }) => ({
                url: `/income/${id}`,
                method: "PUT",
                body: patch,
            }),
            invalidatesTags: (_r, _e, { id }) => [
                { type: "Income", id },
                { type: "Income", id: "LIST" },
            ],
        }),
        deleteIncome: builder.mutation<void, number>({
            query: (id) => ({ url: `/income/${id}`, method: "DELETE" }),
            invalidatesTags: (_r, _e, id) => [
                { type: "Income", id },
                { type: "Income", id: "LIST" },
            ],
        }),

        // ---------------- RECURRING INCOME ----------------
        getRecurringIncome: builder.query<RecurringIncome[], void>({
            query: () => "/recurringIncome",
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((i) => ({ type: "RecurringIncome" as const, id: i.id })),
                        { type: "RecurringIncome" as const, id: "LIST" },
                    ]
                    : [{ type: "RecurringIncome" as const, id: "LIST" }],
        }),
        addRecurringIncome: builder.mutation<RecurringIncome, Partial<RecurringIncome>>({
            query: (body) => ({ url: "/recurringIncome", method: "POST", body }),
            invalidatesTags: [{ type: "RecurringIncome", id: "LIST" }],
        }),
        updateRecurringIncome: builder.mutation<
            RecurringIncome,
            Partial<RecurringIncome> & Pick<RecurringIncome, "id">
        >({
            query: ({ id, ...patch }) => ({
                url: `/recurringIncome/${id}`,
                method: "PUT",
                body: patch,
            }),
            invalidatesTags: (_r, _e, { id }) => [
                { type: "RecurringIncome", id },
                { type: "RecurringIncome", id: "LIST" },
            ],
        }),
        deleteRecurringIncome: builder.mutation<void, number>({
            query: (id) => ({ url: `/recurringIncome/${id}`, method: "DELETE" }),
            invalidatesTags: (_r, _e, id) => [
                { type: "RecurringIncome", id },
                { type: "RecurringIncome", id: "LIST" },
            ],
        }),
    }),
});

export const {
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
