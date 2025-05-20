import { RemediationAdvisor } from "@/components/remediation/remediation-advisor";

export default function RemediationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Intelligent Remediation</h1>
      <p className="text-muted-foreground">
        Use our AI-powered tool to understand non-compliant policies, get remediation steps, and draft exception requests.
      </p>
      <RemediationAdvisor />
    </div>
  );
}
