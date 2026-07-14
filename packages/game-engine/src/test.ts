import { GameEngine } from "./GameEngine.js";
import { GameEvents } from "./GameEvents.js";

const engine = new GameEngine();

engine.events.onEvent(
  GameEvents.ROUND_CREATED,
  ({ round }) => {
    console.log(
      "🎲 New Round",
      `Crash Point: ${round.crashPoint.toFixed(2)}x`,
    );
  },
);

engine.events.onEvent(
  GameEvents.ROUND_STARTED,
  () => {
    console.log("🚀 Round Started");
  },
);

engine.events.onEvent(
  GameEvents.MULTIPLIER_UPDATED,
  ({ multiplier }) => {
    console.log(`${multiplier.toFixed(2)}x`);
  },
);

engine.events.onEvent(
  GameEvents.ROUND_CRASHED,
  () => {
    console.log("💥 CRASH");
  },
);

engine.events.onEvent(
  GameEvents.ROUND_REVEALED,
  () => {
    console.log("🔓 Round Revealed");
  },
);

engine.start();