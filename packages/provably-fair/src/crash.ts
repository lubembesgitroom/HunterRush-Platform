import { generateHmac } from "./hmac.js";

/**
 * Uses the first 52 bits of the HMAC digest.
 * Returns an integer in the range [0, 2^52).
 */
function extract52Bits(hex: string): number {
  return parseInt(hex.slice(0, 13), 16);
}

/**
 * Converts the extracted value into a crash multiplier.
 * This implementation produces deterministic multipliers
 * and never returns less than 1.00x.
 */
export function calculateCrashPoint(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
): number {
  const digest = generateHmac(serverSeed, clientSeed, nonce);

  const value = extract52Bits(digest);

  const max = 2 ** 52;

  const multiplier = 0.99 / (1 - value / max);

  return Math.max(1, Number(multiplier.toFixed(2)));
}