import { createHmac } from "node:crypto";

export function generateHmac(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
): string {
  return createHmac("sha256", serverSeed)
    .update(`${clientSeed}:${nonce}`)
    .digest("hex");
}