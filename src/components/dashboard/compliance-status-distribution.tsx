"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart"; // Assuming ChartConfig is exported
import { mockComplianceItems } from "@/lib/mock-data"; // Using detailed items to aggregate

const chartConfig = {
  compliant: { label: "Compliant", color: "hsl(var(--chart-3))" }, // Greenish
  nonCompliant: { label: "Non-Compliant", color: "hsl(var(--chart-4))" }, // Reddish
  pending: { label: "Pending", color: "hsl(var(--chart-5))" }, // Orangey
} satisfies ChartConfig;


export function ComplianceStatusDistribution() {
  // Aggregate data for chart
  const data = mockComplianceItems.reduce((acc, item) => {
    const initiative = item.policySetDefinitionName || "Unassigned";
    let initiativeData = acc.find(d => d.name === initiative);
    if (!initiativeData) {
      initiativeData = { name: initiative, compliant: 0, nonCompliant: 0, pending: 0 };
      acc.push(initiativeData);
    }
    if (item.status === 'Compliant') initiativeData.compliant++;
    else if (item.status === 'NonCompliant') initiativeData.nonCompliant++;
    else if (item.status === 'Pending') initiativeData.pending++;
    return acc;
  }, [] as Array<{name: string, compliant: number, nonCompliant: number, pending: number}>);


  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg">Compliance Status by Initiative</CardTitle>
        <CardDescription>
          Distribution of compliance statuses across policy initiatives.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-30}
              textAnchor="end"
              height={70} 
              tickFormatter={(value) => value.length > 20 ? `${value.substring(0,17)}...` : value}
            />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              cursor={{ fill: "hsl(var(--accent))", opacity: 0.2 }}
            />
            <Legend 
              formatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value}
            />
            <Bar dataKey="compliant" fill={chartConfig.compliant.color} stackId="a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="nonCompliant" fill={chartConfig.nonCompliant.color} stackId="a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" fill={chartConfig.pending.color} stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Data aggregated from all subscriptions.
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing compliance distribution per policy initiative.
        </div>
      </CardFooter>
    </Card>
  );
}
