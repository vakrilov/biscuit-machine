import type { AppMiddleware, RootState } from "./store";
import { createSlice } from "@reduxjs/toolkit";
import { timeAdvance } from "./time";
import { bakeBiscuits, selectBiscuitsAtPosition } from "./biscuits";
import { selectSwitch } from "./switch";

const LOW_TEMP = 220;
const HIGH_TEMP = 240;
const HEAT_UP_STEP = 5;
const HEAT_DOWN_STEP = 1;

const BAKE_SPEED = 1;

interface OvenState {
  temperature: number;
  isHeaterOn: boolean;
  fromPosition: number;
  toPosition: number;
}

const initialState: OvenState = {
  temperature: 200,
  isHeaterOn: false,
  fromPosition: 100,
  toPosition: 200,
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
      state.temperature += state.isHeaterOn ? HEAT_UP_STEP : -HEAT_DOWN_STEP;
    });
  },
});

export const selectIsOvenReady = (s: RootState) =>
  LOW_TEMP <= s.oven.temperature && s.oven.temperature <= HIGH_TEMP;

export const ovenThermostatMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    if (action.type === timeAdvance.type) {
      const state = storeApi.getState();
      const { isHeaterOn, temperature } = storeApi.getState().oven;
      const switchState = selectSwitch(state);
      if (switchState === "off") {
        if (isHeaterOn) {
          console.log(`[Oven] Switched OFF. Turning heater OFF!`);
          storeApi.dispatch(ovenSlice.actions.turnOff());
        }
      } else {
        if (!isHeaterOn && temperature - HEAT_DOWN_STEP < LOW_TEMP) {
          console.log(
            `[Oven] Temperature is low: ${temperature}C. Turning heater ON!`
          );
          storeApi.dispatch(ovenSlice.actions.turnOn());
        } else if (isHeaterOn && temperature + HEAT_UP_STEP > HIGH_TEMP) {
          console.log(
            `[Oven] Temperature is high: ${temperature}C. Turning heater OFF!`
          );
          storeApi.dispatch(ovenSlice.actions.turnOff());
        }
      }
    }

    return next(action);
  };

export const ovenBakeMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    if (action.type === timeAdvance.type) {
      const state = storeApi.getState();
      const { fromPosition, toPosition } = state.oven;

      const biscuits = selectBiscuitsAtPosition(
        fromPosition,
        toPosition
      )(state);

      console.log(`[Oven] Baking ${biscuits.length} biscuits`);
      storeApi.dispatch(bakeBiscuits({ biscuits, heat: BAKE_SPEED }));
    }

    return next(action);
  };
