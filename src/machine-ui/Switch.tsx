import { FC, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { selectSwitch, SwitchState, setSwitch } from "../store/switch";

import PlayIcon from "@mui/icons-material/PlayArrowRounded";
import StopIcon from "@mui/icons-material/StopRounded";
import PauseIcon from "@mui/icons-material/PauseRounded";

import "./Switch.scss";

export const Switch: FC = () => {
  const dispatch = useAppDispatch();

  const switchValue = useAppSelector(selectSwitch);
  const handleSwitch = useCallback(
    (_: React.MouseEvent<HTMLElement>, value: SwitchState | null) => {
      if (value !== null) {
        dispatch(setSwitch(value));
      }
    },
    [setSwitch]
  );

  return (
    <div className="switch">
      <ToggleButtonGroup value={switchValue} exclusive onChange={handleSwitch}>
        <ToggleButton value="off">
          <StopIcon fontSize="large" />
        </ToggleButton>
        <ToggleButton value="on">
          <PlayIcon fontSize="large" />
        </ToggleButton>
        <ToggleButton value="pause">
          <PauseIcon fontSize="large" />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};
