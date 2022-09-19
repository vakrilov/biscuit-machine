import { AppMiddleware, RootState } from "./store";
import { timeAdvance } from "./time";
import {
  Biscuit,
  moveBiscuits,
  selectBiscuitsAtPosition,
  putBiscuitInJar,
} from "./biscuits";
import { selectSwitch } from "./switch";
import { selectIsOvenReady } from "./oven";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

export const selectIsConveyorMoving = (
  state: RootState
): { moving: boolean; toMove: Biscuit[] } => {
  const switchState = selectSwitch(state);
  const toMove = selectBiscuitsAtPosition(
    state.conveyor.fromPosition,
    state.conveyor.toPosition
  )(state);

  switch (switchState) {
    case "off":
      return { moving: toMove.length > 0, toMove };
    case "on":
      return selectIsOvenReady(state)
        ? { moving: true, toMove }
        : { moving: false, toMove: [] };
    case "pause":
      return { moving: false, toMove: [] };
  }
};

export const conveyorMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    if (action.type === timeAdvance.type) {
      const state = storeApi.getState();

      const { moving, toMove } = selectIsConveyorMoving(state);
      if (moving) {
        storeApi.dispatch(
          moveBiscuits({ biscuits: toMove, speed: state.conveyor.speed })
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
