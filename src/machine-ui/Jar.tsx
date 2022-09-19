import { FC } from "react";
import { useAppSelector } from "../store/hooks";
import { BiscuitComp } from "./BiscuitComp";

import "./Jar.scss";

export const Jar: FC = () => {
  const biscuitsInJar = useAppSelector((s) =>
    s.biscuits.filter((b) => b.location === "jar")
  );

  return (
    <div className="jar">
      {biscuitsInJar.map((b) => (
        <BiscuitComp key={b.id} biscuit={b} />
      ))}
    </div>
  );
};
