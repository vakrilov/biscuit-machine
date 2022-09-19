import type { AppMiddleware, RootState } from "./store";
import { createSlice } from "@reduxjs/toolkit";
import { timeAdvance } from "./time";
import {
  bakeBiscuits,
  selectAreBiscuitInProgress,
  selectBiscuitsAtPosition,
} from "./biscuits";
import { selectSwitch } from "./switch";

export const ROOM_TEMP = 160;
export const LOW_TEMP = 220;
export const HIGH_TEMP = 240;
const HEAT_UP_STEP = 3;
const HEAT_DOWN_STEP = 1;

const BAKE_SPEED = 2.5;

type OvenState = {
  temperature: number;
  isHeaterOn: boolean;
  fromPosition: number;
  toPosition: number;
};

export const initialState: OvenState = {
  temperature: ROOM_TEMP,
  isHeaterOn: false,
  fromPosition: 300,
  toPosition: 500,
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
      state.temperature = Math.max(ROOM_TEMP, state.temperature);
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

      if (switchState === "off" && !selectAreBiscuitInProgress(state)) {
        if (isHeaterOn) {
          storeApi.dispatch(ovenSlice.actions.turnOff());
        }
      } else {
        if (!isHeaterOn && temperature - HEAT_DOWN_STEP < LOW_TEMP) {
          storeApi.dispatch(ovenSlice.actions.turnOn());
        } else if (isHeaterOn && temperature + HEAT_UP_STEP > HIGH_TEMP) {
          storeApi.dispatch(ovenSlice.actions.turnOff());
        }
      }
    }

    return next(action);
  };

export const ovenBakeMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    const state = storeApi.getState();
    if (action.type === timeAdvance.type && selectIsOvenReady(state)) {
      const { fromPosition, toPosition } = state.oven;
      const biscuits = selectBiscuitsAtPosition(
        fromPosition,
        toPosition
      )(state);

      storeApi.dispatch(bakeBiscuits({ biscuits, heat: BAKE_SPEED }));
    }

    return next(action);
  };
