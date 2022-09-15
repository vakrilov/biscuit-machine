import type { AppMiddleware } from "./store";

export type Time = {
  isRunning: boolean;
  speed: number;
};

export type Oven = {
  temp: number;
};

export type Biscuit = {
  state: "ball" | "flat";
  backed: number;
  position: number;
};

export type Extruder = {};

export type Stamper = {};

export type Conveyor = {
  isRunning: boolean;
};


