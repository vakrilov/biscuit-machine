import { AppMiddleware } from "./store";
import { pulseAction } from "./motor";
import { addBiscuit, createBiscuit } from "./biscuits";

const POSITION = 0;
export const extruderMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    if (action.type === pulseAction.type) {
      console.log("[Extruder] Slurp!");
      const newBiscuit = createBiscuit(POSITION);
      storeApi.dispatch(addBiscuit(newBiscuit));
    }

    return next(action);
  };
