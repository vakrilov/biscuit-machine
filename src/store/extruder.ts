import { AppMiddleware, RootState } from "./store";
import { pulseAction } from "./motor";
import { addBiscuit, createBiscuit } from "./biscuits";
import { selectSwitch } from "./switch";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ExtruderState = {
  position: number;
};

const initialState: ExtruderState = {
  position: 50,
};

export const extruderSlice = createSlice({
  name: "extruder",
  initialState,
  reducers: {
    setPosition: (state, action: PayloadAction<number>) => {
      state.position = action.payload;
    },
  },
});

export const selectExtruderPosition = (s: RootState) => s.extruder.position;

export const extruderMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    const state = storeApi.getState();
    const switchState = selectSwitch(state);
    const position = selectExtruderPosition(state);
    if (action.type === pulseAction.type && switchState === "on") {
      const newBiscuit = createBiscuit(position);
      storeApi.dispatch(addBiscuit(newBiscuit));
    }

    return next(action);
  };
