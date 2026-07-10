export class Timer {
  private timeout: NodeJS.Timeout | null = null;
  private interval: NodeJS.Timeout | null = null;

  once(delay: number, callback: () => void): void {
    this.stop();

    this.timeout = setTimeout(() => {
      this.timeout = null;
      callback();
    }, delay);
  }

  repeat(intervalMs: number, callback: () => void): void {
    this.stop();

    this.interval = setInterval(callback, intervalMs);
  }

  stop(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  get running(): boolean {
    return this.timeout !== null || this.interval !== null;
  }
}