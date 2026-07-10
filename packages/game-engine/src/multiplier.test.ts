import { Multiplier } from "./Multiplier.js";

const multiplier = new Multiplier();

console.log("Starting multiplier...");

const interval = setInterval(() => {
  const value = multiplier.tick();

  console.log(value.toFixed(2));

  if (value >= 5) {
    clearInterval(interval);
    console.log("✅ Reached 5x");
  }
}, 50);