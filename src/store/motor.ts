import { createAction } from "@reduxjs/toolkit";
import type { AppMiddleware, RootState } from "./store";
import { timeAdvance } from "./time";
import { selectIsOvenReady } from "./oven";
import { selectAreBiscuitInProgress } from "./biscuits";

const PULSE_EVERY = 10;

export const pulseAction = createAction("motor/pulse");

/**
 * Motor should move if:
 *  - switch is ON and oven is heated
 *  - switch is off but there are still biscuits in progress
 */
export const selectIsMotorOn = (state: RootState) =>
  (state.switch === "on" && selectIsOvenReady(state)) ||
  (state.switch === "off" && selectAreBiscuitInProgress(state));

/**
 * Pulses every 10 time tick in which the motor is moving
 */
export const motorPulseMiddleware: AppMiddleware = (storeApi) => (next) => {
  let timeSinceLastPulse = PULSE_EVERY - 1;
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
