export function calculatePayout(
  wager: number,
  multiplier: number,
): number {
  return Number(
    (wager * multiplier).toFixed(2),
  );
}

export function calculateProfit(
  wager: number,
  multiplier: number,
): number {
  return Number(
    (
      wager * multiplier -
      wager
    ).toFixed(2),
  );
}