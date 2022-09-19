import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { reducer } from "./store";
import { setSpeed, timeAdvance, timeMiddleware } from "./time";

const config = () => {
  const store = configureStore({ reducer });
  const dispatchSpy = vi.spyOn(store, "dispatch");
  const invoke = (action: any) => timeMiddleware(store)(store.dispatch)(action);
  return { dispatchSpy, invoke };
};
describe("timeMiddleware", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("set speed to 1 calls time advance after a while", () => {
    const { dispatchSpy, invoke } = config();

    invoke(setSpeed(1));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1000);
    expect(dispatchSpy).toHaveBeenCalledWith(timeAdvance());
  });

  it("set speed to 0 does not time advance after a while", () => {
    const { dispatchSpy, invoke } = config();

    invoke(setSpeed(0));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1000);
    expect(dispatchSpy).not.toHaveBeenCalledWith(timeAdvance());
  });
});
