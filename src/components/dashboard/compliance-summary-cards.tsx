import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockComplianceSummary } from "@/lib/mock-data";
import type { ComplianceSummary } from "@/lib/types";
import { Target, CheckCircle2, AlertTriangle, Percent } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  iconColor?: string;
}

function SummaryCard({ title, value, icon: Icon, description, iconColor = "text-primary" }: SummaryCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

export function ComplianceSummaryCards() {
  // In a real app, this data would come from props or a store
  const summary: ComplianceSummary = mockComplianceSummary;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Total Resources"
        value={summary.totalResources}
        icon={Target}
        description="Total resources evaluated"
      />
      <SummaryCard
        title="Compliant Resources"
        value={summary.compliantResources}
        icon={CheckCircle2}
        iconColor="text-green-600"
        description={`${Math.round((summary.compliantResources / summary.totalResources) * 100)}% compliant`}
      />
      <SummaryCard
        title="Non-Compliant Resources"
        value={summary.nonCompliantResources}
        icon={AlertTriangle}
        iconColor="text-red-600"
        description={`${Math.round((summary.nonCompliantResources / summary.totalResources) * 100)}% non-compliant`}
      />
      <SummaryCard
        title="Overall Compliance"
        value={`${summary.compliancePercentage}%`}
        icon={Percent}
        description="Based on evaluated resources"
      />
    </div>
  );
}
