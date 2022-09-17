import "./App.css";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setSpeed } from "./store/time";
import { selectIsMotorOn } from "./store/motor";
import { setSwitch } from "./store/switch";
import { selectIsConveyorMoving } from "./store/conveyor";

function App() {
  const ovenT = useAppSelector((s) => s.oven.temperature);
  const ovenState = useAppSelector((s) => s.oven.isHeaterOn);
  const isMotorOn = useAppSelector(selectIsMotorOn);
  const { moving: isConveyorMoving } = useAppSelector(selectIsConveyorMoving);
  const biscuits = useAppSelector((s) => s.biscuits);
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
        <h3>Switch</h3>
        <button onClick={() => dispatch(setSwitch("on"))}>on</button>
        <button onClick={() => dispatch(setSwitch("off"))}>off</button>
        <button onClick={() => dispatch(setSwitch("pause"))}>pause</button>
        <br />
        Motor: {isMotorOn ? "ON" : "OFF"}
        <br />
        Conveyor: {isConveyorMoving ? "ON" : "OFF"}
      </div>
      <div className="card">
        <h3>Oven</h3>
        Heater: {ovenState ? "ON" : "OFF"}
        <br />
        Temperature: {ovenT}
      </div>
      <div className="card">
        <h3>Biscuits</h3>
        {biscuits.map((b) => (
          <div key={b.id}>{JSON.stringify(b)}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
