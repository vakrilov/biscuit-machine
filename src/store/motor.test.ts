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
    { switch: "off", ovenReady: false, inProgBiscuits: false, expected: false },
    { switch: "off", ovenReady: false, inProgBiscuits: true, expected: false },
    { switch: "off", ovenReady: true, inProgBiscuits: false, expected: false },
    { switch: "off", ovenReady: true, inProgBiscuits: true, expected: true },

    { switch: "on", ovenReady: false, inProgBiscuits: false, expected: false },
    { switch: "on", ovenReady: false, inProgBiscuits: true, expected: false },
    { switch: "on", ovenReady: true, inProgBiscuits: false, expected: true },
    { switch: "on", ovenReady: true, inProgBiscuits: true, expected: true },

    {
      switch: "pause",
      ovenReady: false,
      inProgBiscuits: false,
      expected: false,
    },
    {
      switch: "pause",
      ovenReady: false,
      inProgBiscuits: true,
      expected: false,
    },
    {
      switch: "pause",
      ovenReady: true,
      inProgBiscuits: false,
      expected: false,
    },
    { switch: "pause", ovenReady: true, inProgBiscuits: true, expected: false },
  ])("%j", ({ switch: switchState, ovenReady, inProgBiscuits, expected }) => {
    const state: RootState = {
      ...config().store.getState(),
      switch: switchState as SwitchState,
      oven: { ...initialOven, temperature: ovenReady ? 240 : 0 },
      biscuits: inProgBiscuits ? [createBiscuit()] : [],
    };

    expect(selectIsMotorOn(state)).toBe(expected);
  });
});
