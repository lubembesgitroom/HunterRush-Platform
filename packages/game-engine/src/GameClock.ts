export class GameClock {
  private started = 0;

  start(): void {
    this.started = Date.now();
  }

  elapsed(): number {
    return Date.now() - this.started;
  }

  reset(): void {
    this.started = 0;
  }
}