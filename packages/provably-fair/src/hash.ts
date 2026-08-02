import { sha256Hex } from "./crypto.js";

export function hashServerSeed(serverSeed: string): string {
  return sha256Hex(serverSeed);
}