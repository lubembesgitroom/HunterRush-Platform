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

function generateId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export class GameEngine {
  /* ==========================================
     Managers
  ========================================== */

  public readonly events = new EventBus();

  public readonly players = new PlayerManager();

  public readonly bets = new BetManager();

  public readonly cashouts = new CashoutManager();

  private readonly fairness =
    new ProvablyFairService();

  private readonly rounds =
    new RoundManager();

  private readonly machine =
    new StateMachine();

  private readonly phases =
    new PhaseController(this.machine);

  private readonly loop =
    new GameLoop();

  /* ==========================================
     Runtime State
  ========================================== */

  private currentMultiplier = 1;

  private totalWagered = 0;

  private countdownRemainingMs = 0;

  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  private readonly waitingTimeMs = 4000;

  private readonly bettingTimeMs = 7000;

  private readonly maxWaitingTimeMs = 8000;

  /* ==========================================
     PLAYER MANAGEMENT
  ========================================== */

  public connectPlayer(
    id: string,
    username: string,
    balance = 50000,
  ): Player {

    const player =
      this.players.addPlayer(
        id,
        username,
        balance,
      );

    this.events.emitEvent(
      GameEvents.PLAYER_CONNECTED,
      { player },
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

  public disconnectPlayer(
    id: string,
  ): void {

    const player =
      this.players.getPlayer(id);

    if (!player) return;

    this.players.disconnectPlayer(id);

    this.events.emitEvent(
      GameEvents.PLAYER_DISCONNECTED,
      { player },
    );
  }

  /* ==========================================
     BETTING
  ========================================== */

  public placeBet(
    playerId: string,
    amount: number,
    autoCashout: number | null,
    panelId?: number,
  ): Bet {

    const player =
      this.players.getPlayer(playerId);

    if (!player)
      throw new Error(
        "Player not found.",
      );

    const round =
      this.rounds.getCurrent();

    if (!round)
      throw new Error(
        "No active round.",
      );

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

      id: generateId(),

      playerId: player.id,

      roundId: round.id,

      panelId,

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

    this.totalWagered += amount;

    this.events.emitEvent(
      GameEvents.BET_PLACED,
      { bet },
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
    /* ==========================================
     MANUAL CASHOUT
  ========================================== */

  public cashout(
    playerId: string,
    panelId?: number,
  ): void {

    const round =
      this.rounds.getCurrent();

    if (!round) {
      throw new Error(
        "No active round.",
      );
    }

    if (
      this.phases.current() !==
      "RUNNING"
    ) {
      throw new Error(
        "Round is not running.",
      );
    }

    const bets =
      this.bets.getRoundBets(
        round.id,
      );

    const bet = bets.find(
      (candidate) =>
        candidate.playerId === playerId &&
        candidate.status === "active" &&
        (panelId === undefined ||
          candidate.panelId === panelId),
    );

    if (!bet) {
      throw new Error(
        "No active bet.",
      );
    }

    const result =
      this.cashouts.manualCashout(
        bet,
        this.currentMultiplier,
      );

    if (!result) {
      throw new Error(
        "Unable to cash out.",
      );
    }

    this.players.credit(
      playerId,
      result.payout,
    );

    const player =
      this.players.getPlayer(
        playerId,
      );

    if (player) {

      this.events.emitEvent(
        GameEvents.BALANCE_UPDATED,
        {
          playerId,
          balance: player.balance,
        },
      );
    }

    this.events.emitEvent(
      GameEvents.PLAYER_CASHED_OUT,
      result,
    );
  }

  /* ==========================================
     ENGINE
  ========================================== */

  public start(): void {

    console.log(
      "🎮 HunterRush Engine Started",
    );

    this.startWaitingPhase();
  }

  /* ==========================================
     PUBLIC GETTERS
  ========================================== */

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

  public getActiveBets(): Bet[] {

    const round =
      this.rounds.getCurrent();

    if (!round) {
      return [];
    }

    return this.bets.getRoundBets(
      round.id,
    );
  }

  public getTotalWagered(): number {

    return this.totalWagered;
  }

  /* ==========================================
     SNAPSHOT
  ========================================== */

  public getSnapshot() {

    const round =
      this.getCurrentRound();

    const visibleRound =
      this.phases.current() === "RUNNING" ||
      this.phases.current() === "CRASHED" ||
      this.phases.current() === "REVEAL"
        ? null
        : round;

    return {

      phase:
        this.phases.current(),

      multiplier:
        this.currentMultiplier,

      round: visibleRound,

      roundHistory:
        this.getRoundHistory(),

      players:
        this.getConnectedPlayers(),

      playersOnline:
        this.players.connectedCount(),

      activeBets:
        round
          ? this.bets.getRoundBets(
              round.id,
            )
          : [],

      totalWagered:
        this.totalWagered,

      countdownMs:
        this.countdownRemainingMs,
    };
  }

  private clearCountdown(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  private emitCountdown(): void {
    this.events.emitEvent(
      GameEvents.COUNTDOWN_UPDATED,
      {
        remainingMs: this.countdownRemainingMs,
      },
    );
  }

  private toPublicRound(round: {
    id: string;
    createdAt: number;
    crashPoint: number;
    serverSeed: string;
    serverSeedHash: string;
    clientSeed: string;
    nonce: number;
  }) {
    return {
      id: round.id,
      createdAt: round.createdAt,
      crashPoint: 1,
      serverSeed: "",
      serverSeedHash: "",
      clientSeed: "",
      nonce: 0,
    };
  }
    /* ==========================================
     ROUND LIFECYCLE
  ========================================== */

  private startWaitingPhase(): void {
    this.clearCountdown();
    this.currentMultiplier = 1;
    this.phases.waiting();
    this.countdownRemainingMs = Math.min(
      this.waitingTimeMs,
      this.maxWaitingTimeMs,
    );
    this.emitCountdown();

    this.countdownTimer = setInterval(() => {
      this.countdownRemainingMs = Math.max(
        0,
        this.countdownRemainingMs - 250,
      );
      this.emitCountdown();

      if (this.countdownRemainingMs <= 0) {
        this.clearCountdown();
        this.nextRound();
      }
    }, 250);

    this.events.emitEvent(
      GameEvents.WAITING_STARTED,
      {
        remainingMs: this.countdownRemainingMs,
      },
    );
  }

  private nextRound(): void {
    this.clearCountdown();

    const fair =
      this.fairness.createRound();

    const round =
      this.rounds.create(fair);

    this.phases.betting();
    this.countdownRemainingMs = this.bettingTimeMs;

    this.events.emitEvent(
      GameEvents.ROUND_HASH_PUBLISHED,
      {
        hash: round.serverSeedHash,
      },
    );

    this.events.emitEvent(
      GameEvents.ROUND_CREATED,
      {
        round: this.toPublicRound(round),
      },
    );

    this.events.emitEvent(
      GameEvents.BETTING_OPENED,
      {
        round: this.toPublicRound(round),
      },
    );

    this.events.emitEvent(
      GameEvents.HISTORY_UPDATED,
      this.rounds.getHistory(),
    );

    this.emitCountdown();

    console.log("");
    console.log(
      "════════════════════════════════════",
    );
    console.log("🎲 NEW ROUND");
    console.log("Round :", round.id);
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

    this.countdownTimer = setInterval(() => {
      this.countdownRemainingMs = Math.max(
        0,
        this.countdownRemainingMs - 250,
      );
      this.emitCountdown();

      if (this.countdownRemainingMs <= 0) {
        this.clearCountdown();
        this.startRound();
      }
    }, 250);
  }

  private startRound(): void {

    const round =
      this.rounds.getCurrent();

    if (!round) {
      return;
    }

    this.clearCountdown();
    this.countdownRemainingMs = 0;
    this.emitCountdown();
    this.phases.running();

    this.bets.activateRound(
      round.id,
    );

    this.events.emitEvent(
      GameEvents.ROUND_STARTED,
      {
        round: this.toPublicRound(round),
      },
    );

    this.loop.start(
      (multiplier) => {

        this.currentMultiplier =
          multiplier;

        this.events.emitEvent(
          GameEvents.MULTIPLIER_UPDATED,
          {
            multiplier,
          },
        );

        this.processAutoCashouts(
          round.id,
          multiplier,
        );

        if (
          multiplier >=
          round.crashPoint
        ) {
          this.loop.stop();

          this.crashRound(round.id);
        }
      },
    );
  }

  private processAutoCashouts(
    roundId: string,
    multiplier: number,
  ): void {

    const bets =
      this.bets.getRoundBets(
        roundId,
      );

    for (const bet of bets) {

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
            playerId: player.id,
            balance: player.balance,
          },
        );
      }

      this.events.emitEvent(
        GameEvents.PLAYER_CASHED_OUT,
        result,
      );
    }
  }

  private crashRound(
    roundId: string,
  ): void {

    const round =
      this.rounds.getCurrent();

    if (!round) {
      return;
    }

    this.phases.crashed();

    this.bets.markLost(
      roundId,
    );

    this.events.emitEvent(
      GameEvents.ROUND_CRASHED,
      {
        round: this.toPublicRound(round),
      },
    );

    this.revealRound();
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
        nonce:
          round.nonce,
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
    }, 1500);
  }
}