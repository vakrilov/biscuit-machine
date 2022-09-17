import { configureStore, Middleware } from "@reduxjs/toolkit";
import { motorPulseMiddleware, motorSlice } from "./motor";
import { ovenSlice, overThermostatMiddleware } from "./oven";
import { timeSlice, timeMiddleware } from "./time";

export const store = configureStore({
  reducer: {
    time: timeSlice.reducer,
    oven: ovenSlice.reducer,
    motor: motorSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      timeMiddleware as Middleware,
      overThermostatMiddleware as Middleware,
      motorPulseMiddleware as Middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppMiddleware = Middleware<{}, RootState, AppDispatch>;
