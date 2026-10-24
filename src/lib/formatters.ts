const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Replaces Latin digits (0-9) with Persian digits (۰-۹).
 */
export function toPersianDigits(n: number | string): string {
  return String(n).replace(/\d/g, (char) => PERSIAN_DIGITS[Number(char)] ?? char);
}

/**
 * Formats a number with comma separators, Persian digits, and appends 'تومان'.
 */
export function formatToman(amount: number): string {
  // ponytail: Intl.NumberFormat covers grouping; swap with custom formatting if special currency layout needed
  const formatted = new Intl.NumberFormat('en-US').format(amount);
  return `${toPersianDigits(formatted)} تومان`;
}

/**
 * Parses Persian or English formatted currency string into a number.
 */
export function parseToman(text: string): number {
  if (!text) return 0;
  const normalized = text
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[^\d-]/g, '');

  const parsed = parseInt(normalized, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}
