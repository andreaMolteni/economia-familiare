export function  subtractMonthsSafe(date: Date, months: number): Date {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // mese target
    const targetMonth = month - months;

    // crea una data provvisoria giorno 1 del mese target
    const temp = new Date(year, targetMonth, 1);

    // ottieni il numero di giorni del mese target
    const daysInTargetMonth = new Date(
        temp.getFullYear(),
        temp.getMonth() + 1,
        0
    ).getDate();

    // scegli il giorno pi� grande possibile
    const safeDay = Math.min(day, daysInTargetMonth);

    return new Date(temp.getFullYear(), temp.getMonth(), safeDay);
}


export function getDateDDMMYYYY(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
}

/**
 * Restituisce la prima data >= start che cade nel giorno `targetDay`
 * (1-31), saltando i mesi che non hanno quel giorno.
 */
export function getNextAvailableDayOfMonth(start: Date, targetDay: number): Date {
    if (targetDay < 1 || targetDay > 31) {
        throw new Error("targetDay deve essere tra 1 e 31");
    }

    let year = start.getFullYear();
    let month = start.getMonth(); // 0 = gennaio, 11 = dicembre

    // massimo 24 iterazioni di sicurezza (2 anni)
    for (let i = 0; i < 24; i++) {
        // giorni nel mese corrente
        const daysInThisMonth = new Date(year, month + 1, 0).getDate();

        if (targetDay <= daysInThisMonth) {
            const candidate = new Date(year, month, targetDay);

            // se la data candidata � >= start, la usiamo
            if (candidate >= start) {
                return candidate;
            }
        }

        // passa al mese successivo
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
    }

    // in pratica non ci arrivi mai
    throw new Error("Impossibile trovare una data valida");
}