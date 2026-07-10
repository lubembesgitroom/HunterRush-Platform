import { EventBus } from "./EventBus.js";
import { GameEvents } from "./GameEvents.js";
import { GameLoop } from "./GameLoop.js";
import { GameState } from "./GameState.js";
import { PhaseController } from "./PhaseController.js";
import { RoundManager } from "./RoundManager.js";
import { StateMachine } from "./StateMachine.js";

export class GameEngine {
  public readonly events = new EventBus();

  private readonly rounds = new RoundManager();
  private readonly stateMachine = new StateMachine();
  private readonly phases = new PhaseController(this.stateMachine);
  private readonly loop = new GameLoop();

  start(): void {
    console.log("🎮 HunterRush Engine Started");

    this.nextRound();
  }

  private nextRound(): void {
    const round = this.rounds.create();

    this.phases.betting();

    this.events.emitEvent(GameEvents.ROUND_CREATED, {
      round,
    });

    this.events.emitEvent(GameEvents.BETTING_OPENED, {
      round,
    });

    setTimeout(() => {
      this.startRound();
    }, 8000);
  }

  private startRound(): void {
    const round = this.rounds.current();

    if (!round) return;

    this.phases.running();

    this.events.emitEvent(GameEvents.ROUND_STARTED, {
      round,
    });

    const crashPoint = round.multiplier;

    this.loop.start((multiplier) => {
      this.events.emitEvent(
        GameEvents.MULTIPLIER_UPDATED,
        {
          multiplier,
        },
      );

      if (multiplier >= crashPoint) {
        this.loop.stop();

        this.phases.crashed();

        this.events.emitEvent(
          GameEvents.ROUND_CRASHED,
          {
            round,
          },
        );

        this.revealRound();
      }
    });
  }

  private revealRound(): void {
    const round = this.rounds.current();

    if (!round) return;

    this.phases.reveal();

    this.events.emitEvent(
      GameEvents.ROUND_REVEALED,
      {
        round,
      },
    );

    setTimeout(() => {
      this.nextRound();
    }, 3000);
  }
}