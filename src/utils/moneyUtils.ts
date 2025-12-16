import type { Expense, Income } from '../../types';
import { subtractMonthsSafe } from '../utils/dateUtils';


/**
* funzione  per il filtraggio dei dati per il mese corrente
*/
export const filterInMonth = (exp: (Expense[] | Income[]), fixedDate: Date) => {
    const start: Date = subtractMonthsSafe(fixedDate, 1);

    return exp.filter(r => {
        const d = new Date(r.date);
        return d >= start && d < fixedDate;
    });
}

/**
 * filtra le spese ricorrenti
 * @param exp
 * @returns
 */
export const filterRecurring = (exp: (Expense[] | Income[])) => {
    return exp.filter(exp => exp.recurring.months.length > 0);
}


/**
 * filtra le spese ricorrenti del mese corrente
 * @param exp
 * @param fixedDate
 * @returns
 */
export const filterRecurringOnMonth = (exp: (Expense[] | Income[]), fixedDate: Date) => {
    const targetDay: number = fixedDate.getDay();
    const etargetMonth: number = fixedDate.getMonth();

    return exp.filter(r => {
        const expensesDay: number = new Date(r.date).getDay();

        if ((targetDay - expensesDay) >= 0 && r.recurring.months.includes(etargetMonth)) {
            return r
        } else if ((targetDay - expensesDay) < 0 && r.recurring.months.includes(etargetMonth - 1)) {
            return r
        }
    });
}