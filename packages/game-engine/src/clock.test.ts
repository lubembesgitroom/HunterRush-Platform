import { GameClock } from "./GameClock.js";

const clock = new GameClock();

clock.start();

setTimeout(() => {
  console.log(clock.elapsed());
}, 2000);