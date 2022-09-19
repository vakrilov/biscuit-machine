import React from "react";
import { useAppSelector } from "./store/hooks";
import { Paper } from "@mui/material";
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
import { Stack } from "@mui/system";

export const Analytics: React.FC = () => {
  const data = useAppSelector((s) => s.analytics);
  return (
    <Paper elevation={3} style={{ padding: "1rem" }}>
      <Stack direction="row">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            width={500}
            height={300}
            data={data}
            syncId="time"
            title="Temperature"
          >
            <YAxis type="number" domain={[20, 250]} />
            <CartesianGrid stroke="#eee" />
            <Tooltip />
            <ReferenceArea y1={220} y2={240} />
            <Line
              dataKey="temperature"
              stroke="red"
              dot={false}
              isAnimationActive={false}
            />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart width={500} height={300} data={data} syncId="time">
            <XAxis />
            <YAxis />
            <CartesianGrid stroke="#eee" />
            <Tooltip />
            <Line
              dataKey="conveyor"
              stroke="blue"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="jar"
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
            <Legend />
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart width={500} height={300} data={data} syncId="time">
            <XAxis />
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
      </Stack>
    </Paper>
  );
};
