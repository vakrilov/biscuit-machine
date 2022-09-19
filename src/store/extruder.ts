import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppMiddleware, RootState } from "./store";
import { pulseAction } from "./motor";
import { addBiscuit, createBiscuit } from "./biscuits";
import { selectSwitch } from "./switch";

const MAX = 64;
let pulseCount = 0;
export const extruderSlice = createSlice({
  name: "extruder",
  initialState: {
    position: 50,
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

export const selectExtruderPosition = (s: RootState) => s.extruder.position;
export const selectExtruderPulse = (s: RootState) => s.extruder.pulse;
export const selectHasDough = (s: RootState) => s.biscuits.length < MAX;

export const extruderMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    const state = storeApi.getState();
    const switchState = selectSwitch(state);
    const position = selectExtruderPosition(state);
    if (
      action.type === pulseAction.type &&
      switchState === "on" &&
      selectHasDough(state)
    ) {
      const newBiscuit = createBiscuit(position);
      storeApi.dispatch(addBiscuit(newBiscuit));
      storeApi.dispatch(extruderSlice.actions.setPulse(++pulseCount));
    }

    return next(action);
  };
