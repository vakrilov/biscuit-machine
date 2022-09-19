import { FC } from "react";
import { useAppSelector } from "../store/hooks";
import { TIME_INTERVAL } from "../store/time";
import { Oven } from "./Oven";
import { Extruder } from "./Extruder";
import { Stamper } from "./Stamper";
import { Conveyor } from "./Conveyor";
import { Jar } from "./Jar";
import { Switch } from "./Switch";

import "./Machine.scss";

export const Machine: FC = () => {
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
      <Jar />
      <Switch />
    </div>
  );
};
