import assert from "node:assert/strict";
import test from "node:test";

import { BetPanelState, deriveBetPanelState } from "./betPanelState";

test("resets stale cashout state when a new betting phase begins", () => {
  const state = deriveBetPanelState("BETTING", "CASHED_OUT");

  assert.equal(state, BetPanelState.READY);
});

test("resets stale loss state when a new waiting phase begins", () => {
  const state = deriveBetPanelState("WAITING", "LOST");

  assert.equal(state, BetPanelState.WAITING);
});

test("preserves cashout state through crash and reveal phases", () => {
  assert.equal(
    deriveBetPanelState("CRASHED", "CASHED_OUT"),
    BetPanelState.CASHED_OUT,
  );

  assert.equal(
    deriveBetPanelState("REVEAL", "CASHED_OUT"),
    BetPanelState.CASHED_OUT,
  );
});
