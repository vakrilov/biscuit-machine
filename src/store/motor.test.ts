import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it, vi } from "vitest";
import { createBiscuit } from "./biscuits";
import { motorPulseMiddleware, pulseAction, selectIsMotorOn } from "./motor";
import { initialState as initialOven } from "./oven";
import { reducer, RootState } from "./store";
import { SwitchState } from "./switch";
import { timeAdvance } from "./time";

const config = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({ reducer, preloadedState });
  const dispatchSpy = vi.spyOn(store, "dispatch");
  const middlewareInstance = motorPulseMiddleware(store)(store.dispatch);
  const invoke = middlewareInstance;
  return { store, dispatchSpy, invoke };
};
describe("motorPulseMiddleware", () => {
  it("does not pulse when switched off", () => {
    const { invoke, dispatchSpy } = config({ switch: "off" });

    for (let i = 0; i < 20; i++) {
      invoke(timeAdvance());
    }
    expect(dispatchSpy).not.toHaveBeenCalledWith(pulseAction());
  });

  it("does pulse when switched on", () => {
    const { invoke, dispatchSpy } = config({
      switch: "on",
      oven: { ...initialOven, temperature: 240 },
    });

    for (let i = 0; i < 20; i++) {
      invoke(timeAdvance());
    }
    expect(dispatchSpy).toHaveBeenCalledWith(pulseAction());
  });
});
describe("motorPulseMiddleware", () => {
  it.each([
    { switch: "off", oven: false, inProgBiscuits: false, expected: false },
    { switch: "off", oven: false, inProgBiscuits: true, expected: true },
    { switch: "off", oven: true, inProgBiscuits: false, expected: false },
    { switch: "off", oven: true, inProgBiscuits: true, expected: true },

    { switch: "on", oven: false, inProgBiscuits: false, expected: false },
    { switch: "on", oven: false, inProgBiscuits: true, expected: false },
    { switch: "on", oven: true, inProgBiscuits: false, expected: true },
    { switch: "on", oven: true, inProgBiscuits: true, expected: true },

    { switch: "pause", oven: false, inProgBiscuits: false, expected: false },
    { switch: "pause", oven: false, inProgBiscuits: true, expected: false },
    { switch: "pause", oven: true, inProgBiscuits: false, expected: false },
    { switch: "pause", oven: true, inProgBiscuits: true, expected: false },
  ])(
    "%j",
    ({ switch: switchState, oven: ovenReady, inProgBiscuits, expected }) => {
      const state: RootState = {
        ...config().store.getState(),
        switch: switchState as SwitchState,
        oven: { ...initialOven, temperature: ovenReady ? 240 : 0 },
        biscuits: inProgBiscuits ? [createBiscuit()] : [],
      };

      expect(selectIsMotorOn(state)).toBe(expected);
    }
  );
});
