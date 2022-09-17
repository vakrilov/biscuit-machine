import "./App.css";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setSpeed } from "./store/time";
import { selectIsMotorOn, turnMotorOff, turnMotorOn } from "./store/motor";

function App() {
  const ovenT = useAppSelector((s) => s.oven.temperature);
  const ovenState = useAppSelector((s) => s.oven.isHeaterOn);
  const isMotorOn = useAppSelector(selectIsMotorOn);
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
        <h3>Motor</h3>
        <button onClick={() => dispatch(turnMotorOn())}>on</button>
        <button onClick={() => dispatch(turnMotorOff())}>off</button>
        <br />
        {isMotorOn ? "ON" : "OFF"}
      </div>
      <div className="card">
        <h3>Oven</h3>
        Heater: {ovenState ? "ON" : "OFF"}
        <br />
        Temperature: {ovenT}
      </div>
    </div>
  );
}

export default App;
