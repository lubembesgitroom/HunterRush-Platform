export function formatCurrency(
  amount: number,
): string {
  return new Intl.NumberFormat(
    "en-KE",
    {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(amount);
}

export function formatMultiplier(
  multiplier: number,
): string {
  return `${multiplier.toFixed(2)}×`;
}

export function formatPlayers(
  players: number,
): string {
  return new Intl.NumberFormat(
    "en-US",
  ).format(players);
}

export function formatCount(
  value: number,
): string {
  return new Intl.NumberFormat(
    "en-US",
  ).format(value);
}