import { configureStore, DeepPartial } from "@reduxjs/toolkit";
import {
  describe,
  expect,
  it,
  beforeEach,
  afterEach,
  vi,
  assert,
} from "vitest";
import { HIGH_TEMP, initialState, LOW_TEMP, ovenThermostatMiddleware } from "./oven";
import { reducer, RootState } from "./store";
import { setSpeed, timeAdvance, timeMiddleware } from "./time";

const config = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({ reducer, preloadedState });
  const dispatchSpy = vi.spyOn(store, "dispatch");
  const invoke = (action: any) =>
    ovenThermostatMiddleware(store)(store.dispatch)(action);
  return { store, dispatchSpy, invoke };
};
describe("timeMiddleware", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does noting id not switched off", () => {
    const { store, invoke } = config({ switch: "off" });

    const getOven = () => store.getState().oven;
    const initialTemp = getOven();
    invoke(timeAdvance());
    expect(getOven()).toEqual(initialTemp);
  });

  describe.each(["on", "pause"])("when switch is `%s`", (switchState: any) => {
    it("turns the heater on", () => {
      const { store, invoke } = config({ switch: switchState });

      const getOven = () => store.getState().oven;
      const initial = getOven();

      expect(initial.isHeaterOn).toBeFalsy();
      invoke(timeAdvance());
      expect(getOven().isHeaterOn).toBeTruthy();
      expect(getOven().temperature).toBeGreaterThan(initial.temperature);
    });

    it("turns the heater off eventually", () => {
      const { store, invoke } = config({ switch: switchState });

      const getOven = () => store.getState().oven;
      invoke(timeAdvance());
      expect(getOven().isHeaterOn).toBeTruthy();
      let isHeaterOn = true;
      let i = 0;
      while (i++ < 100 && isHeaterOn) {
        invoke(timeAdvance());
        isHeaterOn = getOven().isHeaterOn;
      }

      expect(isHeaterOn).toBeFalsy();
    });

    it("maintains a temperature within limits", () => {
      const { store, invoke } = config({
        switch: switchState,
        oven: { ...initialState, temperature: 230 },
      });

      const getTemp = () => store.getState().oven.temperature;

      for (let i = 0; i < 1000; i++) {
        invoke(timeAdvance());
        expect(getTemp()).toBeGreaterThanOrEqual(LOW_TEMP);
        expect(getTemp()).toBeLessThanOrEqual(HIGH_TEMP);
      }
    });
  });
});
