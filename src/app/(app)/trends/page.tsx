import { TrendOverviewChart } from "@/components/trends/trend-overview-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockSubscriptions, mockPolicyInitiatives } from "@/lib/mock-data";

export default function TrendsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Compliance Trends</h1>
        <div className="flex items-center space-x-2">
          <Select defaultValue="last-6-months">
            <SelectTrigger className="w-[180px]">
              <CalendarDays className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-3-months">Last 3 months</SelectItem>
              <SelectItem value="last-6-months">Last 6 months</SelectItem>
              <SelectItem value="last-12-months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <TrendOverviewChart />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg">Trends by Subscription</CardTitle>
            <CardDescription>Filter trends for a specific subscription.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Subscription" />
              </SelectTrigger>
              <SelectContent>
                {mockSubscriptions.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Placeholder for subscription-specific trend chart */}
            <div className="h-[200px] flex items-center justify-center bg-muted rounded-md">
              <p className="text-muted-foreground">Subscription trend chart placeholder</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg">Trends by Policy Initiative</CardTitle>
            <CardDescription>Filter trends for a specific policy initiative.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Policy Initiative" />
              </SelectTrigger>
              <SelectContent>
                {mockPolicyInitiatives.map((initiative) => (
                  <SelectItem key={initiative.id} value={initiative.id}>
                    {initiative.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Placeholder for initiative-specific trend chart */}
            <div className="h-[200px] flex items-center justify-center bg-muted rounded-md">
              <p className="text-muted-foreground">Initiative trend chart placeholder</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
