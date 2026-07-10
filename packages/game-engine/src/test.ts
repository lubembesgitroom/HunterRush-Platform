import { GameEngine } from "./GameEngine.js";
import { GameEvents } from "./GameEvents.js";

const engine = new GameEngine();

engine.events.onEvent(
  GameEvents.ROUND_CREATED,
  ({ round }) => {
    console.log(
      "🎲 New Round",
      round.multiplier,
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
    console.log(multiplier);
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
    console.log("🔓 Revealed");
  },
);

engine.start();