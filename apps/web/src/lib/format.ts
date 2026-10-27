const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const compact = new Intl.NumberFormat("pt-BR", { notation: "compact" });
const longDate = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" });

export const formatBRL = (cents: number) => brl.format(cents / 100);
export const formatCompact = (value: number) => compact.format(value);
export const formatMonthYear = (isoDate: string) => longDate.format(new Date(isoDate));
