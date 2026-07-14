export type HunterState =
  | "IDLE"
  | "COUNTDOWN"
  | "RUNNING"
  | "TRIP"
  | "FALL"
  | "DOWN"
  | "RESET";

export interface HunterAnimation {
  state: HunterState;

  speed: number;

  lean: number;

  dust: number;

  backgroundSpeed: number;

  groundSpeed: number;

  shadowScale: number;

  visible: boolean;
}

export interface HunterProps {
  multiplier: number;

  phase: string;
}

export interface HunterSpriteProps {
  animation: HunterAnimation;
}

export interface DustTrailProps {
  intensity: number;
}

export interface GroundProps {
  speed: number;
}

export interface BackgroundScrollerProps {
  speed: number;
}