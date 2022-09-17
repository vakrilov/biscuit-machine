import type { RootState } from "./store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Biscuit = {
  id: number;
  state: "created" | "stamped";
  cooked: number;
  position: number;
};

const initialState: Biscuit[] = [];

let idCount = 0;
export const createBiscuit = (position: number = 0): Biscuit => ({
  id: idCount++,
  state: "created",
  cooked: 0,
  position,
});

export const biscuitsSlice = createSlice({
  name: "biscuits",
  initialState,
  reducers: {
    addBiscuit: (state, action: PayloadAction<Biscuit>) => {
      state.push(action.payload);
    },
    stampBiscuits: (state, action: PayloadAction<Biscuit[]>) => {
      const idsToFilter = action.payload.map((b) => b.id);
      const toStamp = state.filter((b) => idsToFilter.includes(b.id));
      toStamp.forEach((b) => (b.state = "stamped"));
    },
    moveBiscuits: (
      state,
      action: PayloadAction<{ biscuits: Biscuit[]; speed: number }>
    ) => {
      const idsToFilter = action.payload.biscuits.map((b) => b.id);
      const toMove = state.filter((b) => idsToFilter.includes(b.id));
      toMove.forEach((b) => (b.position += action.payload.speed));
    },

    bakeBiscuits: (
      state,
      action: PayloadAction<{ biscuits: Biscuit[]; heat: number }>
    ) => {
      const idsToFilter = action.payload.biscuits.map((b) => b.id);
      const toBake = state.filter((b) => idsToFilter.includes(b.id));
      toBake.forEach((b) => (b.cooked += action.payload.heat));
    },
  },
});

export const { addBiscuit, stampBiscuits, moveBiscuits, bakeBiscuits } =
  biscuitsSlice.actions;

export const selectBiscuitsAtPosition =
  (from: number, to: number) => (state: RootState) =>
    state.biscuits.filter(
      (b) => from <= b.position && b.position < to
    );
