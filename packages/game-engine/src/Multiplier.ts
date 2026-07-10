export class Multiplier {
  private value = 1.0;

  reset(): void {
    this.value = 1.0;
  }

  tick(): number {
    this.value *= 1.01;

    return Number(this.value.toFixed(2));
  }

  current(): number {
    return Number(this.value.toFixed(2));
  }
}