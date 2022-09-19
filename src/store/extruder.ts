import { AppMiddleware, RootState } from "./store";
import { pulseAction } from "./motor";
import { addBiscuit, createBiscuit } from "./biscuits";
import { selectSwitch } from "./switch";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

let pulseCount = 0;
type ExtruderState = {
  position: number;
  pulse: number;
};

const initialState: ExtruderState = {
  position: 50,
  pulse: 0,
};

export const extruderSlice = createSlice({
  name: "extruder",
  initialState,
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

export const extruderMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    const state = storeApi.getState();
    const switchState = selectSwitch(state);
    const position = selectExtruderPosition(state);
    if (action.type === pulseAction.type && switchState === "on") {
      const newBiscuit = createBiscuit(position);
      storeApi.dispatch(addBiscuit(newBiscuit));
      storeApi.dispatch(extruderSlice.actions.setPulse(++pulseCount));
    }

    return next(action);
  };
