import type { AppMiddleware, RootState } from "./store";
import { createAction, createSlice } from "@reduxjs/toolkit";
import { timeAdvance, timeSlice } from "./time";

interface MotorState {
  isOn: boolean;
}

const initialState: MotorState = {
  isOn: true,
};

export const motorSlice = createSlice({
  name: "oven",
  initialState,
  reducers: {
    turnMotorOn: (state) => {
      state.isOn = true;
    },
    turnMotorOff: (state) => {
      state.isOn = false;
    },
  },
});

const PULSE_EVERY = 10;
export const pulseAction = createAction("motor/pulse");

export const { turnMotorOff, turnMotorOn } = motorSlice.actions;

export const selectIsMotorOn = (state: RootState) => state.motor.isOn;

export const motorPulseMiddleware: AppMiddleware = (storeApi) => (next) => {
  var timeSinceLastPulse = 0;
  return (action) => {
    const isOn = selectIsMotorOn(storeApi.getState());

    if (isOn && action.type === timeAdvance.type) {
      timeSinceLastPulse++;

      if (timeSinceLastPulse >= PULSE_EVERY) {
        console.log("[Motor] Pulse!")
        storeApi.dispatch(pulseAction());
        timeSinceLastPulse = 0;
      }
    }

    return next(action);
  };
};
