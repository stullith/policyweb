
import { z } from "zod";

// Base schema for Key Vault and common API details
const keyVaultBaseSchema = z.object({
  keyVaultUri: z.string().url("Invalid Key Vault URI.").min(1, "Key Vault URI is required."),
  subscriptionId: z.string().uuid("Invalid Subscription ID format. Must be a UUID."),
  apiEndpoint: z.string().url("Invalid API Endpoint URL.").optional().or(z.literal('')),
  configName: z.string().min(1, "Configuration name is required.").optional().describe("A user-friendly name for this configuration."),
});

// Schema for Service Principal with Client Secret from Key Vault
const clientSecretFromKvSchema = keyVaultBaseSchema.extend({
  apiAuthMethod: z.literal("clientSecretInKv"),
  tenantIdSecretName: z.string().min(1, "Tenant ID Secret Name is required."),
  clientIdSecretName: z.string().min(1, "Client ID Secret Name is required."),
  clientSecretName: z.string().min(1, "Client Secret Name is required."),
});

// Schema for Service Principal with Client Certificate from Key Vault
const clientCertificateFromKvSchema = keyVaultBaseSchema.extend({
  apiAuthMethod: z.literal("clientCertificateInKv"),
  tenantIdSecretName: z.string().min(1, "Tenant ID Secret Name is required."),
  clientIdSecretName: z.string().min(1, "Client ID Secret Name is required."),
  certificateThumbprintSecretName: z.string().min(1, "Certificate Thumbprint Secret Name is required."),
});

// Schema for Azure Managed Identity (credentials for API access from Key Vault or implicit)
const managedIdentitySchema = keyVaultBaseSchema.extend({
  apiAuthMethod: z.literal("managedIdentityInKv"),
  managedIdentityClientIdSecretName: z.string().min(1, "User-Assigned MI Client ID Secret Name is required if its Client ID is in Key Vault.").optional().or(z.literal('')),
});

// Discriminated union for a single data source configuration
export const singleDataSourceSchema = z.discriminatedUnion("apiAuthMethod", [
  clientSecretFromKvSchema,
  clientCertificateFromKvSchema,
  managedIdentitySchema,
]);
export type SingleDataSourceFormData = z.infer<typeof singleDataSourceSchema>;

// Top-level schema for multiple configurations
export const multipleDataSourcesSchema = z.object({
  configurations: z.array(singleDataSourceSchema).min(0, "At least one data source configuration is required if providing any."), // Allow empty array for initial state
});
export type MultipleDataSourcesFormData = z.infer<typeof multipleDataSourcesSchema>;

export const defaultNewConfiguration: SingleDataSourceFormData = {
  keyVaultUri: "",
  apiAuthMethod: "clientSecretInKv",
  tenantIdSecretName: "",
  clientIdSecretName: "",
  clientSecretName: "",
  subscriptionId: "",
  apiEndpoint: "https://management.azure.com",
  configName: "",
  // certificateThumbprintSecretName and managedIdentityClientIdSecretName are implicitly undefined
};

export const CONFIG_FILE_NAME = "azure-data-sources.config.json";
