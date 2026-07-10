import { GameLoop } from "./GameLoop.js";

const loop = new GameLoop();

console.log("Starting loop...");

loop.start((multiplier) => {
  console.log(multiplier);

  if (multiplier >= 5) {
    console.log("💥 Crash");

    loop.stop();
  }
});