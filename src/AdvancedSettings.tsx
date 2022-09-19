import { FC, useCallback, useEffect } from "react";
import {
  Typography,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  Paper,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setSpeed as setTimeSpeed } from "./store/time";
import { setSpeed as setConveyorSpeed } from "./store/conveyor";

import PlayIcon from "@mui/icons-material/PlayArrowRounded";
import PauseIcon from "@mui/icons-material/PauseRounded";
import FWDIcon from "@mui/icons-material/FastForwardRounded";
import SlowMotionIcon from "@mui/icons-material/SlowMotionVideoRounded";
import { Stack } from "@mui/system";
import { selectStamperPosition, setStamperPosition } from "./store/stamper";
import { setOvenWidth } from "./store/oven";
import App from "./App";

export const AdvancedSettings: FC = () => {
  const dispatch = useAppDispatch();
  const timeSpeed = useAppSelector((s) => s.timeSpeed);
  const conveyorSpeed = useAppSelector((s) => s.conveyor.speed);
  const ovenWidth = useAppSelector((s) => s.oven.width);
  const stamperPosition = useAppSelector(selectStamperPosition);

  const handleTime = useCallback(
    (_: React.MouseEvent<HTMLElement>, value: number | null) => {
      if (value !== null) {
        dispatch(setTimeSpeed(value));
      }
    },
    [setTimeSpeed]
  );

  return (
    <Paper elevation={3} style={{ padding: "1rem" }}>
      <Typography variant="h4">Advanced Settings</Typography>

      <Stack direction="row" alignItems="center">
        <Typography variant="body1" sx={{ mr: 2, width: 200 }}>
          Time Speed
        </Typography>
        <ToggleButtonGroup
          value={timeSpeed}
          exclusive
          onChange={handleTime}
          size="small"
        >
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
      </Stack>

      <Stack direction="row" alignItems="center">
        <Typography variant="body1" sx={{ mr: 2, width: 200 }}>
          Belt Speed
        </Typography>
        <Slider
          value={conveyorSpeed}
          onChange={(_, val) => dispatch(setConveyorSpeed(val as number))}
          valueLabelDisplay="auto"
          step={1}
          min={3}
          max={20}
        />
      </Stack>
      <Stack direction="row" alignItems="center">
        <Typography variant="body1" sx={{ mr: 2, width: 200 }}>
          Stamper Position
        </Typography>
        <Slider
          value={stamperPosition}
          onChange={(_, val) => dispatch(setStamperPosition(val as number))}
          valueLabelDisplay="auto"
          step={5}
          min={100}
          max={250}
        />
      </Stack>
      <Stack direction="row" alignItems="center">
        <Typography variant="body1" sx={{ mr: 2, width: 200 }}>
          Oven Width
        </Typography>
        <Slider
          value={ovenWidth}
          onChange={(_, val) => dispatch(setOvenWidth(val as number))}
          valueLabelDisplay="auto"
          step={5}
          min={100}
          max={300}
        />
      </Stack>
    </Paper>
  );
};
