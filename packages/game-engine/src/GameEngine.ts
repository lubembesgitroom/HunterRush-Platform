import { randomUUID } from "node:crypto";

import { EventBus } from "./EventBus.js";
import { GameEvents } from "./GameEvents.js";
import { GameLoop } from "./GameLoop.js";
import { PhaseController } from "./PhaseController.js";
import { ProvablyFairService } from "./ProvablyFairService.js";
import { RoundManager } from "./RoundManager.js";
import { StateMachine } from "./StateMachine.js";

import {
  Bet,
  BetManager,
} from "./BetManager.js";

import {
  Player,
  PlayerManager,
} from "./PlayerManager.js";

import { CashoutManager } from "./CashoutManager.js";

export class GameEngine {
  public readonly events = new EventBus();

  public readonly players =
    new PlayerManager();

  public readonly bets =
    new BetManager();

  public readonly cashouts =
    new CashoutManager();

  private readonly fairness =
    new ProvablyFairService();

  private readonly rounds =
    new RoundManager();

  private readonly stateMachine =
    new StateMachine();

  private readonly phases =
    new PhaseController(
      this.stateMachine,
    );

  private readonly loop =
    new GameLoop();

  // ==========================================
  // Player Management
  // ==========================================

  private currentMultiplier = 1;

private totalWagered = 0;
  connectPlayer(
    id: string,
    username: string,
    balance = 1000,
  ): Player {
    const player =
      this.players.addPlayer(
        id,
        username,
        balance,
      );

    this.events.emitEvent(
      GameEvents.PLAYER_CONNECTED,
      {
        player,
      },
    );

    this.events.emitEvent(
      GameEvents.BALANCE_UPDATED,
      {
        playerId: player.id,
        balance: player.balance,
      },
    );

    return player;
  }

  disconnectPlayer(
    id: string,
  ): void {
    const player =
      this.players.getPlayer(id);

    if (!player) {
      return;
    }

    this.players.disconnectPlayer(id);

    this.events.emitEvent(
      GameEvents.PLAYER_DISCONNECTED,
      {
        player,
      },
    );
  }

  // ==========================================
  // Betting
  // ==========================================

  placeBet(
    playerId: string,
    amount: number,
    autoCashout: number | null,
  ): Bet {
    const player =
      this.players.getPlayer(
        playerId,
      );

    if (!player) {
      throw new Error(
        "Player not found.",
      );
    }

    const round =
      this.rounds.getCurrent();

    if (!round) {
      throw new Error(
        "No active round.",
      );
    }

    if (
      this.phases.current() !==
      "BETTING"
    ) {
      throw new Error(
        "Betting is closed.",
      );
    }

    if (amount <= 0) {
      throw new Error(
        "Invalid amount.",
      );
    }

    const wallet =
      this.players.debit(
        player.id,
        amount,
      );

    if (!wallet) {
      throw new Error(
        "Insufficient balance.",
      );
    }

    const bet: Bet = {
      id: randomUUID(),
      playerId: player.id,
      roundId: round.id,

      amount,

      autoCashout,

      payout: 0,

      status: "pending",

      placedAt: Date.now(),
    };

    const accepted =
      this.bets.placeBet(bet);

    if (!accepted) {
      this.players.credit(
        player.id,
        amount,
      );

      throw new Error(
        "Maximum two bets per round.",
      );
    }

    this.events.emitEvent(
      GameEvents.BET_PLACED,
      {
        bet,
      },
    );

    this.events.emitEvent(
      GameEvents.BALANCE_UPDATED,
      {
        playerId: player.id,
        balance: wallet.balance,
      },
    );

    return bet;
  }

  // ==========================================
  // Round Lifecycle
  // ==========================================

  start(): void {
    console.log(
      "🎮 HunterRush Engine Started",
    );

    this.nextRound();
  }
public getCurrentMultiplier(): number {
  return this.currentMultiplier;
}

public getCurrentRound() {
  return this.rounds.getCurrent();
}

public getRoundHistory() {
  return this.rounds.getHistory();
}

public getPlayers() {
  return this.players.getPlayers();
}

public getConnectedPlayers() {
  return this.players.getConnectedPlayers();
}

public getActiveBets() {
  const round = this.rounds.getCurrent();

  if (!round) {
    return [];
  }

  return this.bets.getRoundBets(round.id);
}

public getTotalWagered(): number {
  return this.totalWagered;
}
public getSnapshot() {
  const round = this.getCurrentRound();

  return {
    phase: this.phases.current(),

    multiplier: this.currentMultiplier,

    round,

    roundHistory: this.getRoundHistory(),

    playersOnline: this.players.connectedCount(),

    players: this.getConnectedPlayers(),

    activeBets: round
      ? this.bets.getRoundBets(round.id)
      : [],

    totalWagered: this.totalWagered,
  };
}
  private nextRound(): void {
        const fair =
      this.fairness.createRound();

    const round =
      this.rounds.create(fair);

    this.phases.betting();

    this.events.emitEvent(
      GameEvents.ROUND_HASH_PUBLISHED,
      {
        hash: round.serverSeedHash,
      },
    );

    this.events.emitEvent(
      GameEvents.ROUND_CREATED,
      {
        round,
      },
    );

    this.events.emitEvent(
      GameEvents.BETTING_OPENED,
      {
        round,
      },
    );

    console.log("");
    console.log(
      "════════════════════════════════════",
    );
    console.log("🎲 NEW ROUND");
    console.log(
      "Round :",
      round.id,
    );
    console.log(
      "Hash  :",
      round.serverSeedHash,
    );
    console.log(
      "Crash :",
      round.crashPoint,
    );
    console.log(
      "════════════════════════════════════",
    );

    setTimeout(() => {
      this.startRound();
    }, 8000);
  }

  private startRound(): void {
    const round =
      this.rounds.getCurrent();

    if (!round) {
      return;
    }

    this.phases.running();

    this.bets.activateRound(
      round.id,
    );

    this.events.emitEvent(
      GameEvents.ROUND_STARTED,
      {
        round,
      },
    );

    this.loop.start(
      (multiplier) => {
        this.currentMultiplier = multiplier;
        this.events.emitEvent(
          GameEvents.MULTIPLIER_UPDATED,
          {
            multiplier,
          },
        );

        const roundBets =
          this.bets.getRoundBets(
            round.id,
          );

        for (const bet of roundBets) {
          const result =
            this.cashouts.autoCashout(
              bet,
              multiplier,
            );

          if (!result) {
            continue;
          }

          this.players.credit(
            result.playerId,
            result.payout,
          );

          const player =
            this.players.getPlayer(
              result.playerId,
            );

          if (player) {
            this.events.emitEvent(
              GameEvents.BALANCE_UPDATED,
              {
                playerId:
                  player.id,
                balance:
                  player.balance,
              },
            );
          }

          this.events.emitEvent(
            GameEvents.PLAYER_CASHED_OUT,
            result,
          );
        }

        if (
          multiplier >=
          round.crashPoint
        ) {
          this.loop.stop();

          this.phases.crashed();

          this.bets.markLost(
            round.id,
          );

          this.events.emitEvent(
            GameEvents.ROUND_CRASHED,
            {
              round,
            },
          );

          this.revealRound();
        }
      },
    );
  }

  private revealRound(): void {
    const round =
      this.rounds.getCurrent();

    if (!round) {
      return;
    }

    this.phases.reveal();

    this.events.emitEvent(
      GameEvents.ROUND_REVEALED,
      {
        round,
        serverSeed:
          round.serverSeed,
        clientSeed:
          round.clientSeed,
        nonce: round.nonce,
      },
    );

    console.log("");
    console.log(
      "══════════ ROUND REVEAL ══════════",
    );
    console.log(
      "Server Seed :",
      round.serverSeed,
    );
    console.log(
      "Server Hash :",
      round.serverSeedHash,
    );
    console.log(
      "Client Seed :",
      round.clientSeed,
    );
    console.log(
      "Nonce       :",
      round.nonce,
    );
    console.log(
      "Crash Point :",
      round.crashPoint,
    );
    console.log(
      "══════════════════════════════════",
    );

    this.bets.clearRound(
      round.id,
    );

    this.rounds.finish();

    setTimeout(() => {
      this.nextRound();
    }, 3000);
  }
}