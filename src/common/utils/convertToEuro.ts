export function convertCentsToEuro(
    amount: number | string,
    options?: Intl.NumberFormatOptions
): string {
    amount = Number(amount) / 100;
    return Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        ...options,
    }).format(Number(amount));
}

