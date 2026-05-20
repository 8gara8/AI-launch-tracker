// Parse a "YYYY-MM-DD" date-only string as local time rather than UTC midnight,
// so toLocaleDateString and getDate/getMonth don't shift the day backward in
// non-UTC timezones.
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatLocalDate(
  iso: string,
  opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
): string {
  return parseLocalDate(iso).toLocaleDateString("en-US", opts);
}
