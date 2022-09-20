import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export type Biscuit = {
  id: number;
  state: "created" | "stamped";
  cooked: number;
  position: number;
  location: "conveyor" | "jar";
};

const initialState: Biscuit[] = [];

let idCount = 0;
export const createBiscuit = (position: number = 0): Biscuit => ({
  id: idCount++,
  state: "created",
  location: "conveyor",
  cooked: 0,
  position,
});

const biscuitsToChange = (toSelect: Biscuit[], state: Biscuit[]) => {
  const idsToFilter = toSelect.map((b) => b.id);
  return state.filter((b) => idsToFilter.includes(b.id));
};

export const biscuitsSlice = createSlice({
  name: "biscuits",
  initialState,
  reducers: {
    addBiscuit: (state, action: PayloadAction<Biscuit>) => {
      state.push(action.payload);
    },

    stampBiscuits: (state, action: PayloadAction<Biscuit[]>) => {
      const toStamp = biscuitsToChange(action.payload, state);
      toStamp.forEach((b) => (b.state = "stamped"));
    },

    moveBiscuits: (
      state,
      action: PayloadAction<{ biscuits: Biscuit[]; speed: number }>
    ) => {
      const toMove = biscuitsToChange(action.payload.biscuits, state);
      toMove.forEach((b) => (b.position += action.payload.speed));
    },

    bakeBiscuits: (
      state,
      action: PayloadAction<{ biscuits: Biscuit[]; heat: number }>
    ) => {
      const toBake = biscuitsToChange(action.payload.biscuits, state);
      toBake.forEach((b) => (b.cooked += action.payload.heat));
    },

    putBiscuitInJar: (state, action: PayloadAction<Biscuit[]>) => {
      const toJar = biscuitsToChange(action.payload, state);
      toJar.forEach((b) => (b.location = "jar"));
    },
  },
});

export const {
  addBiscuit,
  stampBiscuits,
  moveBiscuits,
  bakeBiscuits,
  putBiscuitInJar,
} = biscuitsSlice.actions;

export const selectBiscuitsAtPosition =
  (from: number, to: number) => (state: RootState) =>
    state.biscuits.filter((b) => from <= b.position && b.position < to);

export const selectAreBiscuitInProgress = (state: RootState) =>
  state.biscuits.some((b) => b.location === "conveyor");
