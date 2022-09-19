import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setSpeed } from "./store/time";
import { selectSwitch, setSwitch, SwitchState } from "./store/switch";
import {
  Typography,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Analytics } from "./Analytics";

import PlayIcon from "@mui/icons-material/PlayArrowRounded";
import StopIcon from "@mui/icons-material/StopRounded";
import PauseIcon from "@mui/icons-material/PauseRounded";
import FWDIcon from "@mui/icons-material/FastForwardRounded";
import SlowMotionIcon from "@mui/icons-material/SlowMotionVideoRounded";
import { Machine } from "./machine-ui/Machine";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSpeed(1));
  }, []);

  const switchValue = useAppSelector(selectSwitch);
  const timeSpeed = useAppSelector((s) => s.timeSpeed);

  const handleSwitch = useCallback(
    (_: React.MouseEvent<HTMLElement>, value: SwitchState | null) => {
      if (value !== null) {
        dispatch(setSwitch(value));
      }
    },
    [setSwitch]
  );

  const handleTime = useCallback(
    (_: React.MouseEvent<HTMLElement>, value: number | null) => {
      if (value !== null) {
        dispatch(setSpeed(value));
      }
    },
    [setSpeed]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h2" textAlign="center">
          Biscuit Machine
        </Typography>
      </Grid>

      <Grid item xs={8} alignContent="center">
        <Machine />
      </Grid>

      <Grid item xs={4} textAlign="center">
        <Typography variant="h5">Switch</Typography>
        <ToggleButtonGroup
          value={switchValue}
          exclusive
          onChange={handleSwitch}
        >
          <ToggleButton value="off">
            <StopIcon />
          </ToggleButton>
          <ToggleButton value="on">
            <PlayIcon />
          </ToggleButton>
          <ToggleButton value="pause">
            <PauseIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="h5">Time</Typography>
        <ToggleButtonGroup value={timeSpeed} exclusive onChange={handleTime}>
          <ToggleButton value={0}>
            <PauseIcon />
          </ToggleButton>
          <ToggleButton value={0.33}>
            <SlowMotionIcon />
          </ToggleButton>
          <ToggleButton value={1}>
            <PlayIcon />
          </ToggleButton>
          <ToggleButton value={3}>
            <FWDIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>

      <Grid item xs={4}>
        <Analytics />
      </Grid>
    </Grid>
  );
}

export default App;
