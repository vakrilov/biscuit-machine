import { configureStore, Middleware } from "@reduxjs/toolkit";
import { analyticsMiddleware, analyticsSlice } from "./analytics";
import { biscuitsSlice } from "./biscuits";
import { conveyorMiddleware } from "./conveyor";
import { extruderMiddleware } from "./extruder";
import { motorPulseMiddleware } from "./motor";
import {
  ovenBakeMiddleware,
  ovenSlice,
  ovenThermostatMiddleware,
} from "./oven";
import { stamperMiddleware } from "./stamper";
import { switchSlice } from "./switch";
import { timeSlice, timeMiddleware } from "./time";

const reducer = {
  timeSpeed: timeSlice.reducer,
  switch: switchSlice.reducer,
  oven: ovenSlice.reducer,
  biscuits: biscuitsSlice.reducer,
  analytics: analyticsSlice.reducer,
};

const middlewares: Middleware[] = [
  timeMiddleware,
  ovenThermostatMiddleware,
  ovenBakeMiddleware,
  conveyorMiddleware,
  motorPulseMiddleware,
  extruderMiddleware,
  stamperMiddleware,
  analyticsMiddleware,
];

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppMiddleware = Middleware<{}, RootState, AppDispatch>;
