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
export const filterRecurringOnMonth = (exp: (Expense[] | Income[]), fixedDate: Date): (Expense[] | Income[]) => {
    const targetDay: number = fixedDate.getDate();
    const etargetMonth: number = fixedDate.getMonth() + 1;

    const temp = new Date("2025-01-01");

    console.log("Data temporanera: ", temp);
    console.log("Mese Data temporanera: ", temp.getMonth());

    let exp_new = exp.filter(r => {
        const expensesDay: number = new Date(r.date).getDate();
        const[year, , day] = r.date.split("-");

        if ((targetDay - expensesDay) >= 0 && r.recurring.months.includes(etargetMonth)) {
            return {
                ...r,
                date: `${year}-${etargetMonth}-${day}`,
            }
        } else if ((targetDay - expensesDay) < 0 && r.recurring.months.includes(etargetMonth - 1)) {
            return {
                ...r,
                date: `${year}-${etargetMonth -1 }-${day}`,
            };
        }
    });

    exp_new = exp_new.map((r) => {
        const expensesDay: number = new Date(r.date).getDate();
        const [year, , day] = r.date.split("-");
        const month = (targetDay - expensesDay) >= 0 ? etargetMonth : etargetMonth - 1;
        return {
            ...r,
            date: `${year}-${month}-${day}`,
        };

       
    });
    return exp_new;
}