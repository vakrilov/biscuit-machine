import { configureStore, Middleware } from "@reduxjs/toolkit";
import { ovenSlice, overThermostatMiddleware } from "./oven";
import { timeSlice, timeMiddleware } from "./time";

export const store = configureStore({
  reducer: {
    time: timeSlice.reducer,
    oven: ovenSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      timeMiddleware as Middleware,
      overThermostatMiddleware as Middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppMiddleware = Middleware<{}, RootState, AppDispatch>;
