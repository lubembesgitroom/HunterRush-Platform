export class Multiplier {
  private value = 1.0;

  reset(): void {
    this.value = 1.0;
  }

  update(deltaSeconds: number): number {
    // Exponential growth for a smooth crash-game feel.
    this.value *= Math.exp(0.12 * deltaSeconds);

    return Number(this.value.toFixed(2));
  }

  current(): number {
    return Number(this.value.toFixed(2));
  }
}