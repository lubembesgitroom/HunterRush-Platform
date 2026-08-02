export enum BetPanelState {
  WAITING = "WAITING",
  READY = "READY",
  BET_PLACED = "BET_PLACED",
  RUNNING = "RUNNING",
  CASHED_OUT = "CASHED_OUT",
  LOST = "LOST",
}

export enum BetMode {
  MANUAL = "MANUAL",
  AUTO = "AUTO",
}

export function deriveBetPanelState(
  phase: string,
  betStatus?: string | null,
): BetPanelState {
  if (phase === "WAITING") {
    return BetPanelState.WAITING;
  }

  if (phase === "BETTING") {
    if (betStatus === "PENDING") {
      return BetPanelState.BET_PLACED;
    }

    if (betStatus === "ACTIVE") {
      return BetPanelState.RUNNING;
    }

    if (betStatus === "CASHED_OUT") {
      return BetPanelState.CASHED_OUT;
    }

    if (betStatus === "LOST") {
      return BetPanelState.LOST;
    }

    return BetPanelState.READY;
  }

  if (phase === "RUNNING" || phase === "CRASHED" || phase === "REVEAL") {
    if (betStatus === "ACTIVE") {
      return BetPanelState.RUNNING;
    }

    if (betStatus === "CASHED_OUT") {
      return BetPanelState.CASHED_OUT;
    }

    if (betStatus === "LOST") {
      return BetPanelState.LOST;
    }

    return BetPanelState.READY;
  }

  return BetPanelState.WAITING;
}

export function getButtonLabel(
  state: BetPanelState,
  mode: BetMode,
  multiplier: number,
  autoCashout: number,
): string {
  switch (state) {
    case BetPanelState.WAITING:
      return "WAIT FOR NEXT ROUND";
    case BetPanelState.BET_PLACED:
      return "BET ACCEPTED";
    case BetPanelState.RUNNING:
      if (mode === BetMode.AUTO) {
        return multiplier >= autoCashout
          ? "AUTO CASHED OUT"
          : "AUTO CASH OUT";
      }

      return "CASH OUT";
    case BetPanelState.CASHED_OUT:
      return "CASHED OUT";
    case BetPanelState.LOST:
      return "YOU LOST";
    case BetPanelState.READY:
    default:
      return "PLACE BET";
  }
}
