import { FC } from "react";
import { useAppSelector } from "../store/hooks";
import { ReactComponent as StamperSvg } from "../assets/stamper.svg";
import { selectStamperPosition } from "../store/stamper";

import "./Stamper.scss";

export const Stamper: FC = () => {
  const left = useAppSelector(selectStamperPosition);
  return <StamperSvg className="stamper" style={{ left }} />;
};
