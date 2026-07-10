import { GameEngine } from "./GameEngine.js";
import { GameEvents } from "./GameEvents.js";
import type { GameRoundEvent } from "./types.js";

const engine = new GameEngine();

engine.events.onEvent(
  GameEvents.ROUND_CREATED,
  ({ round }: GameRoundEvent) => {
    console.log("🎮 HunterRush Round Created");
    console.log(round);
  },
);

engine.start();