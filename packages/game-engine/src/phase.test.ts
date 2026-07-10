import { PhaseController } from "./PhaseController.js";
import { StateMachine } from "./StateMachine.js";

const stateMachine = new StateMachine();

const phases = new PhaseController(stateMachine);

console.log(phases.current());

phases.waiting();
console.log(phases.current());

phases.betting();
console.log(phases.current());

phases.running();
console.log(phases.current());

phases.crashed();
console.log(phases.current());

phases.reveal();
console.log(phases.current());