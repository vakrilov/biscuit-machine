import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setSpeed } from "./store/time";

function App() {
  const ovenT = useAppSelector((s) => s.oven.temperature);
  const ovenState = useAppSelector((s) => s.oven.isOn);
  const dispatch = useAppDispatch();

  return (
    <div className="App">
      <div className="card">
        <button onClick={() => dispatch(setSpeed(0))}>stop</button>
        <button onClick={() => dispatch(setSpeed(1))}>1</button>
        <button onClick={() => dispatch(setSpeed(2))}>2</button>
        <button onClick={() => dispatch(setSpeed(3))}>3</button>
        <button onClick={() => dispatch(setSpeed(10))}>10</button>
      </div>
      <div className="card">
        OVEN({ovenState ? "ON" : "OFF"}): {ovenT}
      </div>
    </div>
  );
}

export default App;
