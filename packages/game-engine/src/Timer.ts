export class Timer {
  private handle: NodeJS.Timeout | null = null;

  start(delay: number, callback: () => void): void {
    this.stop();
    this.handle = setTimeout(callback, delay);
  }

  stop(): void {
    if (this.handle) {
      clearTimeout(this.handle);
      this.handle = null;
    }
  }

  restart(delay: number, callback: () => void): void {
    this.start(delay, callback);
  }

  get running(): boolean {
    return this.handle !== null;
  }
}