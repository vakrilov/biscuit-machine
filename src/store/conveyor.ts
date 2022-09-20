import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppMiddleware } from "./store";
import { timeAdvance } from "./time";
import {
  moveBiscuits,
  selectBiscuitsAtPosition,
  putBiscuitInJar,
} from "./biscuits";
import { selectIsMotorOn } from "./motor";

export const conveyorSlice = createSlice({
  name: "conveyor",
  initialState: {
    speed: 5,
    fromPosition: 0,
    toPosition: 620,
  },
  reducers: {
    setSpeed: (state, action: PayloadAction<number>) => {
      state.speed = action.payload;
    },
  },
});

export const { setSpeed } = conveyorSlice.actions;

/**
 * Moves the biscuits on the conveyor or puts them in the jar
 */
export const conveyorMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    if (action.type === timeAdvance.type) {
      const state = storeApi.getState();

      const shouldMove = selectIsMotorOn(state);
      if (shouldMove) {
        const biscuits = selectBiscuitsAtPosition(
          state.conveyor.fromPosition,
          state.conveyor.toPosition
        )(state);
        storeApi.dispatch(
          moveBiscuits({ biscuits, speed: state.conveyor.speed })
        );
      }

      const toPutInJar = selectBiscuitsAtPosition(
        state.conveyor.toPosition,
        Infinity
      )(state);
      if (toPutInJar.length) {
        storeApi.dispatch(putBiscuitInJar(toPutInJar));
      }
    }

    return next(action);
  };
