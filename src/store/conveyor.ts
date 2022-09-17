import { AppMiddleware } from "./store";
import { timeAdvance } from "./time";
import { moveBiscuits, selectBiscuitsAtPosition } from "./biscuits";

const FROM = 0;
const TO = 300;
const SPEED = 1;

const selectBiscuits = selectBiscuitsAtPosition(FROM, TO);
export const conveyorMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    if (action.type === timeAdvance.type) {
      const toMove = selectBiscuits(storeApi.getState());
      console.log(`[Conveyor] Move! Biscuits  to move: ${toMove.length}`);
      storeApi.dispatch(moveBiscuits({ biscuits: toMove, speed: SPEED }));
    }

    return next(action);
  };
