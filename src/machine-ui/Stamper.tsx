import { FC, useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { selectStamperPosition, selectStamperPulse } from "../store/stamper";

import { ReactComponent as StamperBodySvg } from "../assets/stamper-body.svg";
import { ReactComponent as StamperPressSvg } from "../assets/stamper-press.svg";

import "./Stamper.scss";

export const Stamper: FC = () => {
  const left = useAppSelector(selectStamperPosition);
  const pulseCount = useAppSelector(selectStamperPulse);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (pulseCount) {
      setIsPulsing(true);
    }
  }, [pulseCount]);

  // reset animation to be ready for next pulse
  const handleAnimation = useCallback(() => setIsPulsing(false), []);

  return (
    <div className="stamper">
      <StamperPressSvg
        className={`press ${isPulsing ? "pulse" : ""}`}
        onAnimationEnd={handleAnimation}
        style={{ left }}
      />
      <StamperBodySvg
        className="body"
        onAnimationEnd={handleAnimation}
        style={{ left }}
      />
    </div>
  );
};
