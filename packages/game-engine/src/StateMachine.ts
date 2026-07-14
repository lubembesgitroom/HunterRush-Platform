import { GameState } from "./GameState.js";

export interface StateTransition {
  from: GameState;
  to: GameState;
  timestamp: number;
}

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