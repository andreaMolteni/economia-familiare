import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Expense, Income } from '../../types';

export const financeApi = createApi({
    reducerPath: 'financeApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000',
    }),
    tagTypes: ['Expenses', 'Income'],
    endpoints: (builder) => ({
        // ----- EXPENSES -----
        getExpenses: builder.query<Expense[], void>({
            query: () => '/expenses',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((e) => ({ type: 'Expenses' as const, id: e.id })),
                        { type: 'Expenses', id: 'LIST' },
                    ]
                    : [{ type: 'Expenses', id: 'LIST' }],
        }),
        addExpense: builder.mutation<Expense, Partial<Expense>>({
            query: (body) => ({
                url: '/expenses',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Expenses', id: 'LIST' }],
        }),
        updateExpense: builder.mutation<Expense, Partial<Expense> & Pick<Expense, "id">>({
            query: ({ id, ...patch }) => ({
                url: `/expenses/${id}`,
                method: "PUT",
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Expenses", id },
                { type: "Expenses", id: "LIST" }
            ]
        }),
        deleteExpense: builder.mutation<{}, number>({
            query: (id) => ({
                url: `/expenses/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Expenses', id },
                { type: 'Expenses', id: 'LIST' },
            ],
        }),

        // ----- INCOME -----
        getIncome: builder.query<Income[], void>({
            query: () => '/income',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((i) => ({ type: 'Income' as const, id: i.id })),
                        { type: 'Income', id: 'LIST' },
                    ]
                    : [{ type: 'Income', id: 'LIST' }],
        }),
        addIncome: builder.mutation<Income, Partial<Income>>({
            query: (body) => ({
                url: '/income',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Income', id: 'LIST' }],
        }),
        updateIncome: builder.mutation<Income, Partial<Income> & Pick<Income, "id">>({
            query: ({ id, ...patch }) => ({
                url: `/income/${id}`,
                method: "PUT",
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Income", id },
                { type: "Income", id: "LIST" }
            ]
        }),
        deleteIncome: builder.mutation<{}, number>({
            query: (id) => ({
                url: `/income/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Income', id },
                { type: 'Income', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetExpensesQuery,
    useAddExpenseMutation,
    useDeleteExpenseMutation,
    useUpdateExpenseMutation,
    useGetIncomeQuery,
    useAddIncomeMutation,
    useDeleteIncomeMutation,
    useUpdateIncomeMutation
} = financeApi;
