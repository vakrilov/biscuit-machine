import { configureStore, Middleware } from "@reduxjs/toolkit";
import { biscuitsSlice } from "./biscuits";
import { conveyorMiddleware } from "./conveyor";
import { extruderMiddleware } from "./extruder";
import { motorPulseMiddleware, motorSlice } from "./motor";
import { ovenBakeMiddleware, ovenSlice, ovenThermostatMiddleware } from "./oven";
import { stamperMiddleware } from "./stamper";
import { timeSlice, timeMiddleware } from "./time";

export const store = configureStore({
  reducer: {
    time: timeSlice.reducer,
    oven: ovenSlice.reducer,
    motor: motorSlice.reducer,
    biscuits: biscuitsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      timeMiddleware as Middleware,
      ovenThermostatMiddleware as Middleware,
      ovenBakeMiddleware as Middleware,
      conveyorMiddleware as Middleware,
      motorPulseMiddleware as Middleware,
      extruderMiddleware as Middleware,
      stamperMiddleware as Middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppMiddleware = Middleware<{}, RootState, AppDispatch>;
