import type { PolicyComplianceItem, ComplianceSummary, Subscription, PolicyInitiative, TrendDataPoint, PolicyDefinition } from './types';

export const mockSubscriptions: Subscription[] = [
  { id: 'sub-001', displayName: 'Production Subscription A' },
  { id: 'sub-002', displayName: 'Development Subscription B' },
  { id: 'sub-003', displayName: 'Staging Subscription C' },
];

export const mockPolicyInitiatives: PolicyInitiative[] = [
  { id: 'init-001', displayName: 'Azure Security Benchmark v3' },
  { id: 'init-002', displayName: 'HIPAA HITRUST Blueprint' },
  { id: 'init-003', displayName: 'NIST SP 800-53 Rev. 5' },
];

export const mockPolicyDefinitions: PolicyDefinition[] = [
  { id: 'policy-001', displayName: 'Allowed locations', category: 'General' },
  { id: 'policy-002', displayName: 'Audit VMs that do not use managed disks', category: 'Compute' },
  { id: 'policy-003', displayName: 'Enforce HTTPS only for App Service', category: 'App Service' },
  { id: 'policy-004', displayName: 'Require MFA for all admin accounts', category: 'Identity' },
  { id: 'policy-005', displayName: 'Storage accounts should restrict network access', category: 'Storage' },
];

export const mockComplianceItems: PolicyComplianceItem[] = [
  {
    id: 'item-001',
    policyName: 'Allowed locations',
    policySetDefinitionName: 'Azure Security Benchmark v3',
    subscriptionId: 'sub-001',
    resourceId: '/subscriptions/sub-001/resourceGroups/rg-prod/providers/Microsoft.Compute/virtualMachines/vm-prod-01',
    status: 'Compliant',
    timestamp: new Date().toISOString(),
    tags: { environment: 'production', app: 'billing' },
    complianceState: 'Compliant',
    policyDefinitionId: 'policy-001',
    policyAssignmentId: 'assign-001',
    resourceType: 'Microsoft.Compute/virtualMachines',
    resourceLocation: 'eastus',
  },
  {
    id: 'item-002',
    policyName: 'Audit VMs that do not use managed disks',
    policySetDefinitionName: 'Azure Security Benchmark v3',
    subscriptionId: 'sub-001',
    resourceId: '/subscriptions/sub-001/resourceGroups/rg-prod/providers/Microsoft.Compute/virtualMachines/vm-prod-02',
    status: 'NonCompliant',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    tags: { environment: 'production', app: 'inventory' },
    complianceState: 'NonCompliant',
    policyDefinitionId: 'policy-002',
    policyAssignmentId: 'assign-002',
    resourceType: 'Microsoft.Compute/virtualMachines',
    resourceLocation: 'westus',
    nonComplianceDetails: 'Virtual machine is using unmanaged disks.',
  },
  {
    id: 'item-003',
    policyName: 'Enforce HTTPS only for App Service',
    policySetDefinitionName: 'HIPAA HITRUST Blueprint',
    subscriptionId: 'sub-002',
    resourceId: '/subscriptions/sub-002/resourceGroups/rg-dev/providers/Microsoft.Web/sites/webapp-dev-01',
    status: 'Compliant',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    tags: { environment: 'development', app: 'portal' },
    complianceState: 'Compliant',
    policyDefinitionId: 'policy-003',
    policyAssignmentId: 'assign-003',
    resourceType: 'Microsoft.Web/sites',
    resourceLocation: 'centralus',
  },
  {
    id: 'item-004',
    policyName: 'Require MFA for all admin accounts',
    subscriptionId: 'sub-001',
    resourceId: '/subscriptions/sub-001/providers/Microsoft.Authorization/policyAssignments/mfa-assignment',
    status: 'Pending',
    timestamp: new Date().toISOString(),
    complianceState: 'Pending',
    policyDefinitionId: 'policy-004',
    policyAssignmentId: 'assign-004',
    resourceType: 'Microsoft.Authorization/policyAssignments',
    resourceLocation: 'global',
  },
  {
    id: 'item-005',
    policyName: 'Storage accounts should restrict network access',
    policySetDefinitionName: 'NIST SP 800-53 Rev. 5',
    subscriptionId: 'sub-003',
    resourceId: '/subscriptions/sub-003/resourceGroups/rg-staging/providers/Microsoft.Storage/storageAccounts/stagestorage001',
    status: 'NonCompliant',
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    tags: { environment: 'staging', app: 'analytics' },
    complianceState: 'NonCompliant',
    policyDefinitionId: 'policy-005',
    policyAssignmentId: 'assign-005',
    resourceType: 'Microsoft.Storage/storageAccounts',
    resourceLocation: 'eastus2',
    nonComplianceDetails: 'Storage account allows public network access.',
  },
];

export const mockComplianceSummary: ComplianceSummary = {
  totalResources: mockComplianceItems.length,
  compliantResources: mockComplianceItems.filter(item => item.status === 'Compliant').length,
  nonCompliantResources: mockComplianceItems.filter(item => item.status === 'NonCompliant').length,
  compliancePercentage: Math.round(
    (mockComplianceItems.filter(item => item.status === 'Compliant').length / mockComplianceItems.length) * 100
  ),
};

export const mockTrendData: TrendDataPoint[] = [
  { date: 'Jan', compliant: 70, nonCompliant: 30, total: 100 },
  { date: 'Feb', compliant: 75, nonCompliant: 25, total: 100 },
  { date: 'Mar', compliant: 80, nonCompliant: 20, total: 100 },
  { date: 'Apr', compliant: 78, nonCompliant: 22, total: 100 },
  { date: 'May', compliant: 82, nonCompliant: 18, total: 100 },
  { date: 'Jun', compliant: 85, nonCompliant: 15, total: 100 },
];

export const getMockPolicyComplianceItem = (): PolicyComplianceItem => ({
  id: `item-${Math.random().toString(36).substring(7)}`,
  policyName: mockPolicyDefinitions[Math.floor(Math.random() * mockPolicyDefinitions.length)].displayName,
  policySetDefinitionName: mockPolicyInitiatives[Math.floor(Math.random() * mockPolicyInitiatives.length)].displayName,
  subscriptionId: mockSubscriptions[Math.floor(Math.random() * mockSubscriptions.length)].id,
  resourceId: `/subscriptions/sub-mock/resourceGroups/rg-mock/providers/Microsoft.Mock/resources/mock-resource-${Math.random().toString(36).substring(7)}`,
  status: (['Compliant', 'NonCompliant', 'Pending'] as const)[Math.floor(Math.random() * 3)],
  timestamp: new Date(Date.now() - Math.random() * 10 * 86400000).toISOString(),
  tags: { environment: (['production', 'development', 'staging'] as const)[Math.floor(Math.random() * 3)] },
  complianceState: (['Compliant', 'NonCompliant', 'Pending'] as const)[Math.floor(Math.random() * 3)],
  policyDefinitionId: `policy-def-${Math.random().toString(36).substring(7)}`,
  policyAssignmentId: `policy-assign-${Math.random().toString(36).substring(7)}`,
  resourceType: 'Microsoft.Mock/resources',
  resourceLocation: (['eastus', 'westus', 'centralus'] as const)[Math.floor(Math.random() * 3)],
  nonComplianceDetails: Math.random() > 0.7 ? 'Mock non-compliance details.' : undefined,
});

export const mockManyComplianceItems = (count: number): PolicyComplianceItem[] => {
  return Array.from({ length: count }, getMockPolicyComplianceItem);
};
