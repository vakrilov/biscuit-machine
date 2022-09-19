import { AppMiddleware, RootState } from "./store";
import { pulseAction } from "./motor";
import { stampBiscuits, selectBiscuitsAtPosition } from "./biscuits";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StamperState = {
  position: number;
  radius: number;
};

const initialState: StamperState = {
  position: 150,
  radius: 5,
};

export const stamperSlice = createSlice({
  name: "stamper",
  initialState,
  reducers: {
    setPosition: (state, action: PayloadAction<number>) => {
      state.position = action.payload;
    },
  },
});

export const selectStamperPosition = (s: RootState) => s.stamper.position;

export const stamperMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    if (action.type === pulseAction.type) {
      const state = storeApi.getState();
      const { position, radius } = state.stamper;
      const toStamp = selectBiscuitsAtPosition(
        position - radius,
        position + radius
      )(state);
      storeApi.dispatch(stampBiscuits(toStamp));
    }

    return next(action);
  };
