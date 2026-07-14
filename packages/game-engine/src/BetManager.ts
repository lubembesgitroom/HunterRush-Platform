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
  amount: number;
  autoCashout: number | null;
  status: BetStatus;
  payout: number;
  placedAt: number;
}

export class BetManager {
  private readonly bets = new Map<string, Bet[]>();

  placeBet(bet: Bet): boolean {
    const playerBets =
      this.bets.get(bet.playerId) ?? [];

    const roundBets = playerBets.filter(
      (b) =>
        b.roundId === bet.roundId &&
        b.status !== "cancelled",
    );

    if (roundBets.length >= 2) {
      return false;
    }

    playerBets.push(bet);

    this.bets.set(
      bet.playerId,
      playerBets,
    );

    return true;
  }

  getPlayerBets(
    playerId: string,
  ): Bet[] {
    return [
      ...(this.bets.get(playerId) ?? []),
    ];
  }

  getRoundBets(
    roundId: string,
  ): Bet[] {
    const bets: Bet[] = [];

    for (const playerBets of this.bets.values()) {
      for (const bet of playerBets) {
        if (bet.roundId === roundId) {
          bets.push(bet);
        }
      }
    }

    return bets;
  }

  getBet(
    playerId: string,
    betId: string,
  ): Bet | undefined {
    return this.bets
      .get(playerId)
      ?.find((bet) => bet.id === betId);
  }

  cancelBet(
    playerId: string,
    betId: string,
  ): boolean {
    const bet = this.getBet(
      playerId,
      betId,
    );

    if (!bet) {
      return false;
    }

    if (bet.status !== "pending") {
      return false;
    }

    bet.status = "cancelled";

    return true;
  }

  activateRound(
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

  cashoutBet(
    playerId: string,
    betId: string,
    payout: number,
  ): Bet | undefined {
    const bet = this.getBet(
      playerId,
      betId,
    );

    if (!bet) {
      return undefined;
    }

    if (bet.status !== "active") {
      return undefined;
    }

    bet.status = "cashedout";
    bet.payout = payout;

    return bet;
  }

  markLost(
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

  clearRound(
    roundId: string,
  ): void {
    for (const [
      playerId,
      playerBets,
    ] of this.bets) {
      const remaining =
        playerBets.filter(
          (bet) =>
            bet.roundId !== roundId,
        );

      if (remaining.length === 0) {
        this.bets.delete(playerId);
      } else {
        this.bets.set(
          playerId,
          remaining,
        );
      }
    }
  }

  playerHasActiveBet(
    playerId: string,
    roundId: string,
  ): boolean {
    return this.getPlayerBets(
      playerId,
    ).some(
      (bet) =>
        bet.roundId === roundId &&
        (bet.status === "pending" ||
          bet.status === "active"),
    );
  }

  clear(): void {
    this.bets.clear();
  }
}