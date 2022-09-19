import { FC } from "react";
import { useAppSelector } from "../store/hooks";
import { ReactComponent as ExtruderSvg } from "../assets/extruder.svg";
import { selectExtruderPosition } from "../store/extruder";

import "./Extruder.scss";

export const Extruder: FC = () => {
  const left = useAppSelector(selectExtruderPosition);
  return <ExtruderSvg className="extruder" style={{ left }} />;
};
