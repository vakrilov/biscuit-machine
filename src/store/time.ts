import type { AppMiddleware } from "./store";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const timeSlice = createSlice({
  name: "timeSpeed",
  initialState: 0,
  reducers: {
    setSpeed: (state, action: PayloadAction<number>) => action.payload,
  },
});

export const { setSpeed } = timeSlice.actions;
export const timeAdvance = createAction("time/advance");

const TIME_INTERVAL = 100;
export const timeMiddleware: AppMiddleware = (storeApi) => (next) => {
  let timer: number | undefined = undefined;
  return (action) => {
    const result = next(action);
    if (action.type === timeSlice.actions.setSpeed.type) {
      clearInterval(timer);
      const speed = storeApi.getState().timeSpeed;
      if (speed > 0) {
        console.log("Starting timer");
        timer = setInterval(() => {
          storeApi.dispatch(timeAdvance());
        }, TIME_INTERVAL / speed);
      }
    }
    return result;
  };
};
