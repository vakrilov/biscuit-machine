import { AppMiddleware } from "./store";
import { pulseAction } from "./motor";
import { addBiscuit, createBiscuit } from "./biscuits";
import { selectSwitch } from "./switch";

const POSITION = 0;
export const extruderMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    const switchState = selectSwitch(storeApi.getState());
    if (action.type === pulseAction.type && switchState === "on") {
      const newBiscuit = createBiscuit(POSITION);
      storeApi.dispatch(addBiscuit(newBiscuit));
    }

    return next(action);
  };
