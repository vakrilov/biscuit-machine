import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppMiddleware } from "./store";
import { timeAdvance } from "./time";
import { pulseAction } from "./motor";
import { ROOM_TEMP } from "./oven";

export const DATA_POINTS_COUNT = 100;
const OVERCOOKED_LIMIT = 120;
const UNDERCOOKED_LIMIT = 80;
type DataPoint = {
  temperature: number;
  onConveyor: number;
  overcooked: number;
  undercooked: number;
  justRight: number;
  pulse: number;
};

const initialState = new Array<DataPoint>(DATA_POINTS_COUNT).fill({
  temperature: ROOM_TEMP,
  onConveyor: 0,
  overcooked: 0,
  undercooked: 0,
  justRight: 0,
  pulse: 0,
});

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<DataPoint>) => {
      state.push(action.payload);
      if (state.length > DATA_POINTS_COUNT) {
        state.shift();
      }
    },
    pulse: (state) => {
      state[state.length - 1].pulse = 1;
    },
  },
});

export const analyticsMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    const result = next(action);

    if (action.type === timeAdvance.type) {
      const state = storeApi.getState();
      const { temperature } = state.oven;
      let onConveyor = 0;
      let overcooked = 0;
      let undercooked = 0;
      let justRight = 0;
      state.biscuits.forEach((b) => {
        if (b.location === "conveyor") {
          onConveyor++;
        } else {
          if (b.cooked < UNDERCOOKED_LIMIT) {
            undercooked++;
          } else if (b.cooked > OVERCOOKED_LIMIT) {
            overcooked++;
          } else {
            justRight++;
          }
        }
      });

      storeApi.dispatch(
        analyticsSlice.actions.add({
          temperature,
          onConveyor,
          overcooked,
          undercooked,
          justRight,
          pulse: 0,
        })
      );
    }

    if (action.type === pulseAction.type) {
      storeApi.dispatch(analyticsSlice.actions.pulse());
    }

    return result;
  };
