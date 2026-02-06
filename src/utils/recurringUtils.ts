export const monthIndex = (d: Date) => d.getMonth(); // 0..11

export function getMonthValue(value: number | (number | null)[], idx0: number): number | null {
    return Array.isArray(value) ? value[idx0] ?? null : value;
}

export function getMonthDate(date: string | (string | null)[], idx0: number): string | null {
    return Array.isArray(date) ? date[idx0] ?? null : date;
}