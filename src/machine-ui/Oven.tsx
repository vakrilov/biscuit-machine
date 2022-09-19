import { FC } from "react";
import { useAppSelector } from "../store/hooks";

import "./Oven.scss";

export const Oven: FC = () => {
  const oven = useAppSelector((s) => s.oven);
  const heat = -20 + (oven.temperature - 180) / 4;
  return (
    <div
      className="oven"
      style={{
        left: oven.position,
        width: oven.width,
        "--heat": `${heat}px`,
      }}
    >
      <div className="temperature"> {oven.temperature}</div>
      <div className={`led-${oven.isHeaterOn ? "on" : "off"}`}></div>
    </div>
  );
};
