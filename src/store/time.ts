import type { AppMiddleware } from "./store";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TimeState {
  speed: number;
}

const initialState: TimeState = {
  speed: 1,
};

export const timeSlice = createSlice({
  name: "time",
  initialState,
  reducers: {
    setSpeed: (state, action: PayloadAction<number>) => {
      state.speed = action.payload;
    },
  },
});

export const { setSpeed } = timeSlice.actions;
export const timeAdvance = createAction("time/advance");

const TIME_INTERVAL = 1000;
export const timeMiddleware: AppMiddleware = (storeApi) => (next) => {
  let timer: number | undefined = undefined;
  return (action) => {
    const result = next(action);
    if (action.type === timeSlice.actions.setSpeed.type) {
      clearInterval(timer);
      const speed = storeApi.getState().time.speed;
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
