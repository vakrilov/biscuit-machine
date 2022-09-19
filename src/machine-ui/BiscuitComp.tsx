import { FC } from "react";
import { Biscuit } from "../store/biscuits";

import "./BiscuitComp.css";
const MAX = 220;
const colors = [
  "#eabe80",
  "#deb479",
  "#d1aa73",
  "#c5a06c",
  "#b99665",
  "#ac8c5e",
  "#a08258",
  "#947851",
  "#876e4a",
  "#7b6443",
  "#6f5a3d",
  "#635036",
  "#56462f",
  "#4a3c28",
  "#3e3222",
  "#31281b",
  "#251e14",
  "#19140d",
  "#0c0a07",
  "#000000",
];

const getColor = (bake: number) => {
  bake = Math.min(bake, MAX);
  bake = Math.max(bake, 0);
  const index = Math.floor((bake / MAX) * (colors.length - 1));
  return colors[index];
};

export const BiscuitComp: FC<{ biscuit: Biscuit }> = ({ biscuit }) => {


  return (
    <div
      className={`biscuit ${biscuit.state}`}
      style={{
        "--left": biscuit.position,
        "--color": getColor(biscuit.cooked),
      }}
    ></div>
  );
};
