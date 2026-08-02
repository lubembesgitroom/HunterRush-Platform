import { hmacSha256 } from "./crypto.js";

export function generateHmac(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
): string {
  return hmacSha256(serverSeed, `${clientSeed}:${nonce}`);
}