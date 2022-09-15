import type { AppMiddleware } from "./store";
import { createSlice } from "@reduxjs/toolkit";
import { timeAdvance, timeSlice } from "./time";

// Define a type for the slice state
interface OvenState {
  temperature: number;
  isOn: boolean;
}

// Define the initial state using that type
const initialState: OvenState = {
  temperature: 200,
  isOn: false,
};

export const ovenSlice = createSlice({
  name: "oven",
  initialState,
  reducers: {
    turnOn: (state) => {
      state.isOn = true;
    },
    turnOff: (state) => {
      state.isOn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(timeAdvance, (state) => {
      state.temperature += state.isOn ? 5 : -1;
    });
  },
});

const LOW_TEMP = 220;
const HIGH_TEMP = 236;

export const overThermostatMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    if (action.type === timeAdvance.type) {
      const currentTemp = storeApi.getState().oven.temperature;

      if (currentTemp <= LOW_TEMP) {
        console.log(`Oven temperature is low: ${currentTemp}C. Turning ove ON!`)
        storeApi.dispatch(ovenSlice.actions.turnOn());
      } else if (currentTemp >= HIGH_TEMP) {
        console.log(`Oven temperature is high: ${currentTemp}C. Turning ove OFF!`)
        storeApi.dispatch(ovenSlice.actions.turnOff());
      }
    }

    return next(action);
  };
