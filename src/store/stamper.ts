import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppMiddleware, RootState } from "./store";
import { pulseAction } from "./motor";
import { stampBiscuits, selectBiscuitsAtPosition } from "./biscuits";

let pulseCount = 0;
export const stamperSlice = createSlice({
  name: "stamper",
  initialState: {
    position: 150,
    radius: 40,
    pulse: 0,
  },
  reducers: {
    setPosition: (state, action: PayloadAction<number>) => {
      state.position = action.payload;
    },
    setPulse: (state, action: PayloadAction<number>) => {
      state.pulse = action.payload;
    },
  },
});

export const selectStamperPosition = (s: RootState) => s.stamper.position;
export const selectStamperPulse = (s: RootState) => s.stamper.pulse;
export const { setPosition: setStamperPosition } = stamperSlice.actions;

/**
 * Stamper should trigger on every motor pulse
 */
export const stamperMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    if (action.type === pulseAction.type) {
      const state = storeApi.getState();
      const { position, radius } = state.stamper;
      const toStamp = selectBiscuitsAtPosition(
        position - radius,
        position + radius
      )(state);
      storeApi.dispatch(stampBiscuits(toStamp));
      storeApi.dispatch(stamperSlice.actions.setPulse(++pulseCount));
    }

    return next(action);
  };
