import { GameState } from "./GameState.js";
import type { StateTransition } from "./types.js";

export class StateMachine {
  private state: GameState = GameState.WAITING;

  get current(): GameState {
    return this.state;
  }

  transition(next: GameState): StateTransition {
    const previous = this.state;

    this.state = next;

    return {
      from: previous,
      to: next,
      timestamp: Date.now(),
    };
  }

  is(state: GameState): boolean {
    return this.state === state;
  }
}