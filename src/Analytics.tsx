import React from "react";
import { Paper, Typography } from "@mui/material";
import { useAppSelector } from "./store/hooks";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { DATA_POINTS_COUNT } from "./store/analytics";

const CHART_HEIGHT = 180;
const timeFormatter = (value: number) => {
  const val = (DATA_POINTS_COUNT - value) / 10;
  return `${val}s`;
};
export const Analytics: React.FC = () => {
  const data = useAppSelector((s) => s.analytics);
  return (
    <Paper elevation={3} style={{ padding: "1rem" }}>
      <Typography variant="h4">Analytics</Typography>

      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <LineChart data={data} syncId="time">
          <XAxis tickFormatter={timeFormatter} interval={9}></XAxis>
          <YAxis />
          <CartesianGrid stroke="#eee" />
          <Tooltip />
          <Line
            name="preparing"
            dataKey="onConveyor"
            stroke="blue"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            name="just right"
            dataKey="justRight"
            stroke="green"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            dataKey="overcooked"
            stroke="black"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            dataKey="undercooked"
            stroke="orange"
            dot={false}
            isAnimationActive={false}
          />
          <Legend />
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <LineChart data={data} syncId="time" title="Temperature">
          <XAxis tickFormatter={timeFormatter} interval={9} />
          <YAxis type="number" domain={[100, 240]} />
          <CartesianGrid stroke="#eee" />
          <Tooltip />
          <ReferenceArea y1={220} y2={240} />
          <Line
            name="oven temperature"
            dataKey="temperature"
            stroke="red"
            dot={false}
            isAnimationActive={false}
          />
          <Legend />
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <LineChart data={data} syncId="time">
          <XAxis tickFormatter={timeFormatter} interval={9} />
          <YAxis />
          <CartesianGrid stroke="#eee" />
          <Tooltip />
          <Line
            dataKey="pulse"
            type="monotone"
            dot={false}
            isAnimationActive={false}
          />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};
