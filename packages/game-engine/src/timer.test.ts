import { Timer } from "./Timer.js";

const timer = new Timer();

console.log("Starting timer...");

timer.once(3000, () => {
  console.log("⏰ Timer fired after 3 seconds");
});