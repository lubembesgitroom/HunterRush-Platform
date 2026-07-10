import { EventBus } from "./EventBus.js";
import { GameEvents } from "./GameEvents.js";
import { GameState } from "./GameState.js";
import { RoundManager } from "./RoundManager.js";
import { StateMachine } from "./StateMachine.js";

export class GameEngine {
  public readonly events: EventBus;
  public readonly rounds: RoundManager;
  public readonly state: StateMachine;

  constructor() {
    this.events = new EventBus();
    this.rounds = new RoundManager();
    this.state = new StateMachine();
  }

  start(): void {
    const round = this.rounds.create();

    this.state.transition(GameState.BETTING);

    this.events.emitEvent(GameEvents.ROUND_CREATED, {
      round,
    });

    console.log("🎮 HunterRush Game Engine started");
  }

  stop(): void {
    this.state.transition(GameState.WAITING);

    this.rounds.clear();

    console.log("🛑 HunterRush Game Engine stopped");
  }
}