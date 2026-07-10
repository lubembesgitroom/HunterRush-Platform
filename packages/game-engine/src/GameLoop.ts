import { GameClock } from "./GameClock.js";
import { Multiplier } from "./Multiplier.js";
import { Timer } from "./Timer.js";

export class GameLoop {
  private readonly timer = new Timer();

  readonly clock = new GameClock();

  readonly multiplier = new Multiplier();

  start(callback: (multiplier: number) => void): void {
    this.clock.start();

    this.multiplier.reset();

    this.timer.repeat(50, () => {
      const value = this.multiplier.tick();

      callback(value);
    });
  }

  stop(): void {
    this.timer.stop();
    this.clock.reset();
  }

  get running(): boolean {
    return this.timer.running;
  }
}