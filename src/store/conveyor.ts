import { AppMiddleware, RootState } from "./store";
import { timeAdvance } from "./time";
import {
  Biscuit,
  moveBiscuits,
  selectBiscuitsAtPosition,
  putBiscuitInJar,
} from "./biscuits";
import { selectSwitch, SwitchState } from "./switch";
import { selectIsOvenReady } from "./oven";

const FROM = 0;
const TO = 620;
const SPEED = 5;

const selectBiscuitsToMove = selectBiscuitsAtPosition(FROM, TO);
const selectBiscuitsToPutInJar = selectBiscuitsAtPosition(TO, Infinity);

export const selectIsConveyorMoving = (
  state: RootState
): { moving: boolean; toMove: Biscuit[] } => {
  const switchState = selectSwitch(state);
  const toMove = selectBiscuitsToMove(state);

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
      const { moving, toMove } = selectIsConveyorMoving(storeApi.getState());

      if (moving) {
        storeApi.dispatch(moveBiscuits({ biscuits: toMove, speed: SPEED }));
      }

      const toJar = selectBiscuitsToPutInJar(storeApi.getState());
      if (toJar.length) {
        storeApi.dispatch(putBiscuitInJar(toJar));
      }
    }

    return next(action);
  };
