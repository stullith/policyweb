"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockComplianceItems } from "@/lib/mock-data";
import type { PolicyComplianceItem } from "@/lib/types";
import { Eye, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from 'date-fns';

const getStatusBadgeVariant = (status: PolicyComplianceItem['status']) => {
  switch (status) {
    case "Compliant":
      return "default"; // Default is often green-ish or primary
    case "NonCompliant":
      return "destructive";
    case "Pending":
      return "secondary";
    default:
      return "outline";
  }
};

const getStatusIcon = (status: PolicyComplianceItem['status']) => {
  switch (status) {
    case "Compliant":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "NonCompliant":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case "Pending":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    default:
      return null;
  }
}


export function PolicyHighlightsTable() {
  // Displaying top 5 recent non-compliant items or a mix
  const highlights = mockComplianceItems
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 7);

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg">Recent Compliance Activity</CardTitle>
        <CardDescription>
          Overview of the latest policy compliance statuses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Policy Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resource Type</TableHead>
                <TableHead>Last Evaluated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {highlights.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.policyName}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(item.status)} className="flex items-center w-fit">
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{item.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{item.resourceType.split('/').pop()}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" aria-label="View details">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
