import { GameState } from "./GameState.js";
import { StateMachine } from "./StateMachine.js";

export class PhaseController {
  constructor(
    private readonly state: StateMachine,
  ) {}

  waiting(): void {
    this.state.transition(GameState.WAITING);
  }

  betting(): void {
    this.state.transition(GameState.BETTING);
  }

  running(): void {
    this.state.transition(GameState.RUNNING);
  }

  crashed(): void {
    this.state.transition(GameState.CRASHED);
  }

  reveal(): void {
    this.state.transition(GameState.REVEAL);
  }

  current(): GameState {
    return this.state.current;
  }

}