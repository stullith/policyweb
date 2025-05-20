export interface PolicyComplianceItem {
  id: string;
  policyName: string;
  policySetDefinitionName?: string; // Corresponds to policy initiative
  subscriptionId: string;
  resourceId: string;
  status: 'Compliant' | 'NonCompliant' | 'NotStarted' | 'Pending' | 'Exempt';
  timestamp: string; // ISO date string
  tags?: Record<string, string>;
  complianceState: string; // e.g. "Compliant", "NonCompliant"
  policyDefinitionId: string;
  policyAssignmentId: string;
  resourceType: string;
  resourceLocation: string;
  nonComplianceDetails?: string; // Details for non-compliant resources
}

export interface ComplianceSummary {
  totalResources: number;
  compliantResources: number;
  nonCompliantResources: number;
  compliancePercentage: number;
}

export interface Subscription {
  id: string;
  displayName: string;
}

export interface PolicyInitiative {
  id:string;
  displayName: string;
}

export interface PolicyDefinition {
  id: string;
  displayName: string;
  category?: string;
}

export interface TrendDataPoint {
  date: string; // e.g., "Jan", "Feb" or "YYYY-MM-DD"
  compliant: number;
  nonCompliant: number;
  total?: number;
}

export interface RemediationInput {
  policyDefinition: string;
  resourceDetails: string;
}

export interface RemediationOutput {
  remediationSteps: string;
  exceptionRequest: string;
}
