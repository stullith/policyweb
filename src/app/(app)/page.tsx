import { ComplianceSummaryCards } from "@/components/dashboard/compliance-summary-cards";
import { ComplianceStatusDistribution } from "@/components/dashboard/compliance-status-distribution";
import { Filters } from "@/components/dashboard/filters";
import { PolicyHighlightsTable } from "@/components/dashboard/policy-highlights-table";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Compliance Dashboard</h1>
      
      <ComplianceSummaryCards />

      <Filters />

      <div className="grid gap-6 lg:grid-cols-2">
        <ComplianceStatusDistribution />
        <PolicyHighlightsTable />
      </div>
      
      {/* Placeholder for more detailed sections or custom reports */}
      {/* 
      <Card>
        <CardHeader>
          <CardTitle>Custom Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Placeholder for custom report generation or viewing.</p>
        </CardContent>
      </Card>
      */}
    </div>
  );
}
