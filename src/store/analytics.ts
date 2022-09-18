import type { AppMiddleware, RootState } from "./store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { timeAdvance } from "./time";
import { bakeBiscuits, selectBiscuitsAtPosition } from "./biscuits";
import { selectSwitch } from "./switch";

type DataPoint = {
  temperature: number;
  conveyor: number;
  jar: number;
};

const LIMIT = 300;
const initialState = {
  data: new Array<DataPoint>(LIMIT).fill({
    temperature: 30,
    jar: 0,
    conveyor: 0,
  }),
};

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<DataPoint>) => {
      state.data.push(action.payload);
      if (state.data.length > LIMIT) {
        state.data.shift();
      }
    },
  },
});

export const analyticsMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    const result = next(action);

    if (action.type === timeAdvance.type) {
      const state = storeApi.getState();
      const { temperature } = state.oven;
      var conveyor = 0;
      var jar = 0;
      state.biscuits.forEach((b) =>
        b.location === "conveyor" ? conveyor++ : jar++
      );

      storeApi.dispatch(
        analyticsSlice.actions.add({
          temperature,
          conveyor,
          jar,
        })
      );
    }

    return result;
  };
