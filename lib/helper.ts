import { formatInTimeZone } from "date-fns-tz";

export const FormatTimeLocal = (date: Date, format: string): string => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log(userTimeZone);
  return formatInTimeZone(date, userTimeZone, format).toString();
};

export const CalculationDuration = (
  checkInIso: string | null | undefined,
  checkOutIso: string | null | undefined,
): string => {
  if (!checkInIso) return "0h 00m";
  const start = new Date(`${checkInIso}Z`).getTime();
  const end = checkOutIso ? new Date(`${checkOutIso}Z`).getTime() : Date.now();
  const diffMin = Math.max(0, Math.floor((end - start) / 60_000));
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
};
