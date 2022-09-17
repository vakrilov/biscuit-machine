import type { RootState } from "./store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SwitchState = "on" | "off" | "pause";

export const switchSlice = createSlice({
  name: "switch",
  initialState: "off" as SwitchState,
  reducers: {
    setSwitch: (state, action: PayloadAction<SwitchState>) => action.payload,
  },
});

export const { setSwitch } = switchSlice.actions;
export const selectSwitch = (state: RootState) => state.switch;
