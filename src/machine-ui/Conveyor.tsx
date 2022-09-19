import { FC } from "react";
import { useAppSelector } from "../store/hooks";
import { BiscuitComp } from "./BiscuitComp";

import "./Conveyor.scss";

export const Conveyor: FC = () => {
  const biscuitsOnBelt = useAppSelector((s) =>
    s.biscuits.filter((b) => b.location === "conveyor")
  );

  return (
    <>
      <div
        className="belt"
        style={{
          left: 0,
          width: 620,
        }}
      ></div>

      <div>
        {biscuitsOnBelt.map((b) => (
          <BiscuitComp key={b.id} biscuit={b} />
        ))}
      </div>
    </>
  );
};
