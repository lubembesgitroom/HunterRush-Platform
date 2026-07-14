/**
 * Formats a number as Kenyan Shillings (KSh).
 */
export function formatCurrency(
  amount: number,
): string {
  return new Intl.NumberFormat(
    "en-KE",
    {
      style: "currency",
      currency: "KES",
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(amount);
}