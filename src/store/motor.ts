import { createAction } from "@reduxjs/toolkit";
import type { AppMiddleware, RootState } from "./store";
import { timeAdvance } from "./time";
import { selectIsOvenReady } from "./oven";
import { selectAreBiscuitInProgress } from "./biscuits";

const PULSE_EVERY = 10;

export const pulseAction = createAction("motor/pulse");
export const selectIsMotorOn = (state: RootState) =>
  (state.switch === "on" && selectIsOvenReady(state)) ||
  (state.switch === "off" && selectAreBiscuitInProgress(state));

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
