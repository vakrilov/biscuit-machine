import type { AppMiddleware, RootState } from "./store";
import { createAction } from "@reduxjs/toolkit";
import { timeAdvance } from "./time";
import { selectIsOvenReady } from "./oven";

const PULSE_EVERY = 10;

export const pulseAction = createAction("motor/pulse");
export const selectIsMotorOn = (state: RootState) =>
  (state.switch === "on" && selectIsOvenReady(state)) ||
  (state.switch === "off" &&
    selectIsOvenReady(state) &&
    state.biscuits.some((b) => b.location === "conveyor"));

export const motorPulseMiddleware: AppMiddleware = (storeApi) => (next) => {
  let timeSinceLastPulse = 0;
  return (action) => {
    if (
      action.type === timeAdvance.type &&
      selectIsMotorOn(storeApi.getState())
    ) {
      timeSinceLastPulse++;

      if (timeSinceLastPulse >= PULSE_EVERY) {
        storeApi.dispatch(pulseAction());
        timeSinceLastPulse = 0;
      }
    }

    return next(action);
  };
};
