import { FC, useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { ReactComponent as ExtruderSvg } from "../assets/extruder.svg";
import { selectExtruderPosition, selectExtruderPulse } from "../store/extruder";

import "./Extruder.scss";

export const Extruder: FC = () => {
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
  return (
    <ExtruderSvg
      className={`extruder ${isPulsing ? "pulse" : ""}`}
      onAnimationEnd={handleAnimation}
      style={{ left }}
    />
  );
};
