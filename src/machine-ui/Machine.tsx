import { FC } from "react";
import { useAppSelector } from "../store/hooks";
import { BiscuitComp } from "./BiscuitComp";

import { ReactComponent as ExtruderSvg } from "../assets/extruder.svg";
import { ReactComponent as StamperSvg } from "../assets/stamper.svg";
import { selectExtruderPosition } from "../store/extruder";
import { selectStamperPosition } from "../store/stamper";
import { TIME_INTERVAL } from "../store/time";

import "./Machine.css";

export const Extruder: FC = () => {
  const left = useAppSelector(selectExtruderPosition);
  return <ExtruderSvg className="extruder" style={{ left }} />;
};

export const Stamper: FC = () => {
  const left = useAppSelector(selectStamperPosition);
  return <StamperSvg className="stamper" style={{ left }} />;
};

export const Oven: FC = () => {
  const oven = useAppSelector((s) => s.oven);
  const heat = -20 + (oven.temperature - 180) / 4;
  return (
    <div
      className="oven"
      style={{
        left: oven.fromPosition,
        width: oven.toPosition - oven.fromPosition,
        "--heat": `${heat}px`,
      }}
    >
      <div className="temperature"> {oven.temperature}</div>
      <div className={`led-${oven.isHeaterOn ? "on" : "off"}`}></div>
    </div>
  );
};

export const Conveyor: FC = () => {
  const oven = useAppSelector((s) => s.oven);
  return (
    <div
      className="conveyor"
      style={{
        left: 0,
        width: 620,
      }}
    ></div>
  );
};

export const Machine: FC = () => {
  const biscuits = useAppSelector((s) => s.biscuits);
  const timeChunk = useAppSelector((s) =>
    Math.round(s.timeSpeed ? TIME_INTERVAL / s.timeSpeed : 1000)
  );

  return (
    <div
      className="machine"
      style={{
        "--timeChunk": `${timeChunk}ms`,
      }}
    >
      <Extruder />
      <Stamper />
      <Oven />
      <Conveyor />

      <div>
        {biscuits.map((b) => (
          <BiscuitComp key={b.id} biscuit={b} />
        ))}
      </div>
    </div>
  );
};
