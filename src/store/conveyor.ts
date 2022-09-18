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
const TO = 220;
const SPEED = 1;

const selectBiscuitsToMove = selectBiscuitsAtPosition(FROM, TO);
const selectBiscuitsToJar = selectBiscuitsAtPosition(TO, Infinity);

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
        console.log(`[Conveyor] Move! Biscuits to move: ${toMove.length}`);
        storeApi.dispatch(moveBiscuits({ biscuits: toMove, speed: SPEED }));
      }

      const toJar = selectBiscuitsToJar(storeApi.getState());
      if (toJar.length) {
        storeApi.dispatch(putBiscuitInJar(toJar));
      }
    }

    return next(action);
  };
