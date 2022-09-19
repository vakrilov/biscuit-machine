import { useCallback, useEffect } from "react";
import { Typography, Grid } from "@mui/material";
import { useAppDispatch } from "./store/hooks";
import { setSpeed as setTimeSpeed } from "./store/time";
import { Analytics } from "./Analytics";

import { Machine } from "./machine-ui/Machine";
import { AdvancedSettings } from "./AdvancedSettings";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTimeSpeed(1));
  }, []);

  const handleTime = useCallback(
    (_: React.MouseEvent<HTMLElement>, value: number | null) => {
      if (value !== null) {
        dispatch(setTimeSpeed(value));
      }
    },
    [setTimeSpeed]
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

      <Grid item xs={4} textAlign="center" padding={2}>
        <AdvancedSettings />
      </Grid>

      <Grid item xs={12}>
        <Analytics />
      </Grid>
    </Grid>
  );
}

export default App;
