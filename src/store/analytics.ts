import type { AppMiddleware } from "./store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { timeAdvance } from "./time";
import { pulseAction } from "./motor";
import { ROOM_TEMP } from "./oven";

const OVERCOOKED_LIMIT = 120;
type DataPoint = {
  temperature: number;
  conveyor: number;
  jar: number;
  overcooked: number;
  pulse: number;
};

const LIMIT = 100;
const initialState = new Array<DataPoint>(LIMIT).fill({
  temperature: ROOM_TEMP,
  jar: 0,
  conveyor: 0,
  overcooked: 0,
  pulse: 0,
});

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<DataPoint>) => {
      state.push(action.payload);
      if (state.length > LIMIT) {
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
      let conveyor = 0;
      let jar = 0;
      let overcooked = 0;
      state.biscuits.forEach((b) => {
        b.location === "conveyor" ? conveyor++ : jar++;
        overcooked += b.cooked > OVERCOOKED_LIMIT ? 1 : 0;
      });

      storeApi.dispatch(
        analyticsSlice.actions.add({
          temperature,
          conveyor,
          overcooked,
          jar,
          pulse: 0,
        })
      );
    }

    if (action.type === pulseAction.type) {
      storeApi.dispatch(analyticsSlice.actions.pulse());
    }

    return result;
  };
