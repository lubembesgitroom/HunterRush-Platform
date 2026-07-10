import { GameEngine } from "./GameEngine.js";
import { GameEvents } from "./GameEvents.js";

const engine = new GameEngine();

engine.events.onEvent(
  GameEvents.ROUND_CREATED,
  ({ round }) => {
    console.log("🎮 HunterRush Round Created");
    console.log(round);
  },
);

engine.start();