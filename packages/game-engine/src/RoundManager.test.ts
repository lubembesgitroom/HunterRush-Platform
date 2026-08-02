import assert from "node:assert/strict";
import test from "node:test";

import { RoundManager } from "./RoundManager.js";

test("round history should only include finished rounds", () => {
  const rounds = new RoundManager();
  const round = rounds.create({
    serverSeed: "seed",
    serverSeedHash: "hash",
    clientSeed: "client",
    nonce: 1,
    crashPoint: 2.5,
  });

  assert.equal(rounds.getHistory().length, 0);

  rounds.finish();

  assert.equal(rounds.getHistory().length, 1);
  const finishedRound = rounds.getHistory()[0];
  assert.ok(finishedRound);
  assert.equal(finishedRound.id, round.id);
});
