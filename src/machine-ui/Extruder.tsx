import { FC, useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import {
  selectExtruderPosition,
  selectExtruderPulse,
  selectHasDough,
} from "../store/extruder";

import { ReactComponent as ExtruderSvg } from "../assets/extruder.svg";
import { ReactComponent as ExtruderEmptySvg } from "../assets/extruder-empty.svg";

import "./Extruder.scss";

export const Extruder: FC = () => {
  const hasDough = useAppSelector(selectHasDough);
  const left = useAppSelector(selectExtruderPosition);
  const pulseCount = useAppSelector(selectExtruderPulse);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (pulseCount) {
      setIsPulsing(true);
    }
  }, [pulseCount]);

  // reset animation to be ready for next pulse
  const handleAnimation = useCallback(() => setIsPulsing(false), []);

  const SVG = hasDough ? ExtruderSvg : ExtruderEmptySvg;
  return (
    <SVG
      className={`extruder ${isPulsing ? "pulse" : ""}`}
      onAnimationEnd={handleAnimation}
      style={{ left }}
    />
  );
};
