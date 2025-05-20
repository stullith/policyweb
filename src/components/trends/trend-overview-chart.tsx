"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockTrendData } from "@/lib/mock-data";
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  compliant: {
    label: "Compliant",
    color: "hsl(var(--chart-3))", // Greenish
  },
  nonCompliant: {
    label: "Non-Compliant",
    color: "hsl(var(--chart-4))", // Reddish
  },
} satisfies ChartConfig;

export function TrendOverviewChart() {
  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg">Compliance Trend Over Time</CardTitle>
        <CardDescription>
          Monthly trend of compliant vs. non-compliant resources.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={mockTrendData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              cursor={{ stroke: "hsl(var(--accent))", strokeWidth: 1.5 }}
              formatter={(value, name) => [`${value}%`, chartConfig[name as keyof typeof chartConfig]?.label || name]}
            />
            <Legend 
              formatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value}
            />
            <Line
              dataKey="compliant"
              type="monotone"
              stroke={chartConfig.compliant.color}
              strokeWidth={2.5}
              dot={{
                fill: chartConfig.compliant.color,
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="nonCompliant"
              type="monotone"
              stroke={chartConfig.nonCompliant.color}
              strokeWidth={2.5}
              dot={{
                fill: chartConfig.nonCompliant.color,
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
