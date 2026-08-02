import type { Bet } from "./BetManager.js";

export interface CashoutResult {
  betId: string;
  playerId: string;
  panelId?: number;
  multiplier: number;
  payout: number;
}

export class CashoutManager {
  manualCashout(
    bet: Bet,
    multiplier: number,
  ): CashoutResult | null {
    if (bet.status !== "active") {
      return null;
    }

    bet.status = "cashedout";

    bet.payout = Number(
      (bet.amount * multiplier).toFixed(2),
    );

    return {
      betId: bet.id,
      playerId: bet.playerId,
      panelId: bet.panelId,
      multiplier,
      payout: bet.payout,
    };
  }

  autoCashout(
    bet: Bet,
    currentMultiplier: number,
  ): CashoutResult | null {
    if (bet.status !== "active") {
      return null;
    }

    if (bet.autoCashout === null) {
      return null;
    }

    if (currentMultiplier < bet.autoCashout) {
      return null;
    }

    bet.status = "cashedout";

    bet.payout = Number(
      (
        bet.amount *
        bet.autoCashout
      ).toFixed(2),
    );

    return {
      betId: bet.id,
      playerId: bet.playerId,
      panelId: bet.panelId,
      multiplier: bet.autoCashout,
      payout: bet.payout,
    };
  }

  markLost(bet: Bet): void {
    if (bet.status === "active") {
      bet.status = "lost";
    }
  }
}