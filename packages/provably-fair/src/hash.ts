import { createHash } from "node:crypto";

export function hashServerSeed(serverSeed: string): string {
  return createHash("sha256")
    .update(serverSeed)
    .digest("hex");
}