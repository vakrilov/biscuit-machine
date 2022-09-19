import { FC, useCallback } from "react";
import { Typography, Slider, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setSpeed as setTimeSpeed } from "./store/time";
import { setSpeed as setConveyorSpeed } from "./store/conveyor";

import { Stack } from "@mui/system";
import { selectStamperPosition, setStamperPosition } from "./store/stamper";
import { setOvenWidth } from "./store/oven";

export const AdvancedSettings: FC = () => {
  const dispatch = useAppDispatch();
  const timeSpeed = useAppSelector((s) => s.timeSpeed);
  const conveyorSpeed = useAppSelector((s) => s.conveyor.speed);
  const ovenWidth = useAppSelector((s) => s.oven.width);
  const stamperPosition = useAppSelector(selectStamperPosition);

  return (
    <Paper elevation={3} style={{ padding: "1rem", marginBottom: "1rem" }}>
      <Typography variant="h4">Advanced Settings</Typography>

      <Stack direction="row" alignItems="center">
        <Typography variant="body1" sx={{ mr: 2, width: 200 }}>
          Time Speed
        </Typography>
        <Slider
          value={timeSpeed}
          onChange={(_, val) => dispatch(setTimeSpeed(val as number))}
          valueLabelDisplay="auto"
          step={0.2}
          min={0}
          max={3}
        />
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
