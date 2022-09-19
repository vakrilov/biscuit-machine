import { FC } from "react";
import { Biscuit } from "./store/biscuits";

import "./BiscuitComp.css";

export const BiscuitComp: FC<{ biscuit: Biscuit }> = ({ biscuit }) => {
  return (
    <div
      className={`biscuit ${biscuit.state} ${biscuit.location}`}
      style={{ "--left": biscuit.position * 3 }}
    ></div>
  );
};
