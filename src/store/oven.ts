import type { AppMiddleware } from "./store";
import { createSlice } from "@reduxjs/toolkit";
import { timeAdvance, timeSlice } from "./time";

// Define a type for the slice state
interface OvenState {
  temperature: number;
  isHeaterOn: boolean;
}

// Define the initial state using that type
const initialState: OvenState = {
  temperature: 200,
  isHeaterOn: false,
};

export const ovenSlice = createSlice({
  name: "oven",
  initialState,
  reducers: {
    turnOn: (state) => {
      state.isHeaterOn = true;
    },
    turnOff: (state) => {
      state.isHeaterOn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(timeAdvance, (state) => {
      state.temperature += state.isHeaterOn ? 5 : -1;
    });
  },
});

const LOW_TEMP = 220;
const HIGH_TEMP = 236;

export const overThermostatMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    if (action.type === timeAdvance.type) {
      const { isHeaterOn, temperature } = storeApi.getState().oven;

      if (!isHeaterOn && temperature <= LOW_TEMP) {
        console.log(
          `[Oven] Temperature is low: ${temperature}C. Turning heater ON!`
        );
        storeApi.dispatch(ovenSlice.actions.turnOn());
      } else if (isHeaterOn && temperature >= HIGH_TEMP) {
        console.log(
          `[Oven] Temperature is high: ${temperature}C. Turning heater OFF!`
        );
        storeApi.dispatch(ovenSlice.actions.turnOff());
      }
    }

    return next(action);
  };
