// packages/game-engine/src/BetManager.ts

export type BetStatus =
  | "pending"
  | "active"
  | "cashedout"
  | "lost"
  | "cancelled";

export interface Bet {
  id: string;
  playerId: string;
  roundId: string;
  panelId?: number;
  amount: number;
  autoCashout: number | null;
  status: BetStatus;
  payout: number;
  placedAt: number;
}

export class BetManager {
  private readonly bets = new Map<string, Bet[]>();

  // ======================================================
  // Helpers
  // ======================================================

  private getPlayerBetArray(playerId: string): Bet[] {
    let playerBets = this.bets.get(playerId);

    if (!playerBets) {
      playerBets = [];
      this.bets.set(playerId, playerBets);
    }

    return playerBets;
  }

  // ======================================================
  // Place Bet
  // ======================================================

  public placeBet(bet: Bet): boolean {
    const playerBets = this.getPlayerBetArray(
      bet.playerId,
    );

    const betsThisRound = playerBets.filter(
      (b) =>
        b.roundId === bet.roundId &&
        b.status !== "cancelled",
    );

    const existingPanelBet = betsThisRound.find(
      (b) =>
        b.panelId === bet.panelId &&
        b.status !== "cancelled",
    );

    if (existingPanelBet) {
      return false;
    }

    // Maximum 2 bets per round
    if (betsThisRound.length >= 2) {
      return false;
    }

    playerBets.push(bet);

    return true;
  }

  // ======================================================
  // Queries
  // ======================================================

  public getPlayerBets(
    playerId: string,
  ): Bet[] {
    return [...this.getPlayerBetArray(playerId)];
  }

  public getRoundBets(
    roundId: string,
  ): Bet[] {
    const result: Bet[] = [];

    for (const playerBets of this.bets.values()) {
      result.push(
        ...playerBets.filter(
          (bet) => bet.roundId === roundId,
        ),
      );
    }

    return result;
  }

  public getBet(
    playerId: string,
    betId: string,
  ): Bet | undefined {
    return this.getPlayerBetArray(playerId).find(
      (bet) => bet.id === betId,
    );
  }

  public playerHasActiveBet(
    playerId: string,
    roundId: string,
  ): boolean {
    return this.getPlayerBetArray(playerId).some(
      (bet) =>
        bet.roundId === roundId &&
        (bet.status === "pending" ||
          bet.status === "active"),
    );
  }

  // ======================================================
  // State Changes
  // ======================================================

  public activateRound(
    roundId: string,
  ): void {
    for (const playerBets of this.bets.values()) {
      for (const bet of playerBets) {
        if (
          bet.roundId === roundId &&
          bet.status === "pending"
        ) {
          bet.status = "active";
        }
      }
    }
  }

  public cancelBet(
    playerId: string,
    betId: string,
  ): boolean {
    const bet = this.getBet(playerId, betId);

    if (!bet || bet.status !== "pending") {
      return false;
    }

    bet.status = "cancelled";

    return true;
  }

  public cashoutBet(
    playerId: string,
    betId: string,
    payout: number,
  ): Bet | undefined {
    const bet = this.getBet(playerId, betId);

    if (!bet || bet.status !== "active") {
      return undefined;
    }

    bet.status = "cashedout";
    bet.payout = payout;

    return bet;
  }

  public markLost(
    roundId: string,
  ): void {
    for (const playerBets of this.bets.values()) {
      for (const bet of playerBets) {
        if (
          bet.roundId === roundId &&
          bet.status === "active"
        ) {
          bet.status = "lost";
        }
      }
    }
  }

  // ======================================================
  // Cleanup
  // ======================================================

  public clearRound(
    roundId: string,
  ): void {
    for (const [
      playerId,
      playerBets,
    ] of this.bets.entries()) {
      const remaining = playerBets.filter(
        (bet) => bet.roundId !== roundId,
      );

      if (remaining.length === 0) {
        this.bets.delete(playerId);
      } else {
        this.bets.set(playerId, remaining);
      }
    }
  }

  public clear(): void {
    this.bets.clear();
  }
}