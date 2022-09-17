import { AppMiddleware } from "./store";
import { pulseAction } from "./motor";
import { stampBiscuits, selectBiscuitsAtPosition } from "./biscuits";

const POSITION = 50;
const RADIUS = 5;

const selectBiscuits = selectBiscuitsAtPosition(
  POSITION - RADIUS,
  POSITION + RADIUS
);
export const stamperMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    if (action.type === pulseAction.type) {
      const toStamp = selectBiscuits(storeApi.getState());
      console.log(`[Stamper] Stamp! Biscuits at range: ${toStamp.length}`);
      storeApi.dispatch(stampBiscuits(toStamp));
    }

    return next(action);
  };
