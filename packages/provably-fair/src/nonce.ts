let currentNonce = 0;

export function nextNonce(): number {
  currentNonce += 1;
  return currentNonce;
}

export function currentRoundNonce(): number {
  return currentNonce;
}

export function resetNonce(): void {
  currentNonce = 0;
}