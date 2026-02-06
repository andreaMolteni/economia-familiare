export function subtractMonthsSafe(date: Date, months: number): Date {
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

export function formatDDMMYYYYtoYYYYMMDD(dateStr: string): string {
    if (!/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        throw new Error("Formato data non valido. Atteso DD-MM-YYYY");
    }

    const [day, month, year] = dateStr.split("-");

    return `${year}-${month}-${day}`;
}

export function formatYYYYMMDDtoDDMMYYYY(dateStr: string): string {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        throw new Error("Formato data non valido. Atteso YYYY-MM-DD");
    }

    const [year, month, day] = dateStr.split("-");

    return `${day}-${month}-${year}`;
}

export function getDateYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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


export function stringToDate(date: string): Date {
    return new Date(date);
}


export function diffInDays(dateA: Date, dateB: Date): number {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    // Normalizziamo a mezzanotte per evitare problemi di orari / DST
    const utcA = Date.UTC(
        dateA.getFullYear(),
        dateA.getMonth(),
        dateA.getDate()
    );

    const utcB = Date.UTC(
        dateB.getFullYear(),
        dateB.getMonth(),
        dateB.getDate()
    );

    return Math.floor((utcA - utcB) / MS_PER_DAY);
}


export function daysInMonth(year: number, month1to12: number): number {
    return new Date(year, month1to12, 0).getDate();
}

export function toYYYYMMDD(year: number, month1to12: number, day: number): string {
    const mm = String(month1to12).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
}

/** se day=31 e il mese ha 30 o 28 giorni, lo porta all’ultimo giorno disponibile */
export function clampDayToMonth(year: number, month1to12: number, day: number): number {
    return Math.min(day, daysInMonth(year, month1to12));
}

export function accountingMonthIdx(fixedDate: Date): number {
    const idx:number = fixedDate.getMonth();
    return idx
}