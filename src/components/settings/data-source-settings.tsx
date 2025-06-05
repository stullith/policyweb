
"use client";

import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Archive, KeySquare, Building, KeyRound, Fingerprint, ListFilter, Save, Info } from "lucide-react";

const keyVaultBaseSchema = z.object({
  keyVaultUri: z.string().url("Invalid Key Vault URI.").min(1, "Key Vault URI is required."),
  subscriptionId: z.string().uuid("Invalid Subscription ID format. Must be a UUID."),
  apiEndpoint: z.string().url("Invalid API Endpoint URL.").optional().or(z.literal('')),
});

const clientSecretFromKvSchema = keyVaultBaseSchema.extend({
  apiAuthMethod: z.literal("clientSecretInKv"),
  tenantIdSecretName: z.string().min(1, "Tenant ID Secret Name is required."),
  clientIdSecretName: z.string().min(1, "Client ID Secret Name is required."),
  clientSecretName: z.string().min(1, "Client Secret Name is required."),
});

const clientCertificateFromKvSchema = keyVaultBaseSchema.extend({
  apiAuthMethod: z.literal("clientCertificateInKv"),
  tenantIdSecretName: z.string().min(1, "Tenant ID Secret Name is required."),
  clientIdSecretName: z.string().min(1, "Client ID Secret Name is required."),
  certificateThumbprintSecretName: z.string().min(1, "Certificate Thumbprint Secret Name is required."),
});

const managedIdentitySchema = keyVaultBaseSchema.extend({
  apiAuthMethod: z.literal("managedIdentityInKv"),
  // If Azure API is accessed by UAMI, its Client ID might be stored in KV.
  managedIdentityClientIdSecretName: z.string().min(1, "User-Assigned MI Client ID Secret Name is required if its Client ID is in Key Vault.").optional().or(z.literal('')),
});


const dataSourceSchema = z.discriminatedUnion("apiAuthMethod", [
  clientSecretFromKvSchema,
  clientCertificateFromKvSchema,
  managedIdentitySchema,
]);

type DataSourceFormData = z.infer<typeof dataSourceSchema>;

export function DataSourceSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<DataSourceFormData>({
    resolver: zodResolver(dataSourceSchema),
    defaultValues: {
      keyVaultUri: "",
      apiAuthMethod: "clientSecretInKv",
      tenantIdSecretName: "",
      clientIdSecretName: "",
      clientSecretName: "",
      // certificateThumbprintSecretName will be undefined initially unless apiAuthMethod is clientCertificateInKv
      subscriptionId: "",
      apiEndpoint: "https://management.azure.com",
      // managedIdentityClientIdSecretName will be undefined initially
    },
  });

  const watchedApiAuthMethod = form.watch("apiAuthMethod");

  const onSubmit: SubmitHandler<DataSourceFormData> = async (data) => {
    setIsLoading(true);
    console.log("Saving Key Vault and API data source settings:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Settings Saved",
      description: "Azure Key Vault and API data source settings have been saved.",
    });
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Archive className="mr-2 h-5 w-5 text-primary" />
          Azure Data Source (via Key Vault)
        </CardTitle>
        <CardDescription>
          Configure Azure Key Vault details to fetch Azure REST API credentials.
          The application must have permissions (e.g., via Managed Identity) to access the specified Key Vault.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="keyVaultUri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Archive className="mr-2 h-4 w-4 text-muted-foreground" />
                    Azure Key Vault URI
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., https://your-keyvault-name.vault.azure.net/" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiAuthMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <KeySquare className="mr-2 h-4 w-4 text-muted-foreground" />
                    Azure API Authentication Method (Credentials from Key Vault)
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select API authentication method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="clientSecretInKv">Service Principal with Client Secret</SelectItem>
                      <SelectItem value="clientCertificateInKv">Service Principal with Client Certificate</SelectItem>
                      <SelectItem value="managedIdentityInKv">Azure Managed Identity (for API Access)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This method determines what type of credential will be fetched from Key Vault to authenticate to the Azure API.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(watchedApiAuthMethod === "clientSecretInKv" || watchedApiAuthMethod === "clientCertificateInKv") && (
              <>
                <FormField
                  control={form.control}
                  name="tenantIdSecretName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                        Tenant ID (Secret Name in Key Vault)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Name of secret storing Tenant ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientIdSecretName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                        Client ID (Secret Name in Key Vault)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Name of secret storing Client ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {watchedApiAuthMethod === "clientSecretInKv" && (
              <FormField
                control={form.control}
                name="clientSecretName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                      Client Secret (Secret Name in Key Vault)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Name of secret storing Client Secret" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchedApiAuthMethod === "clientCertificateInKv" && (
              <FormField
                control={form.control}
                name="certificateThumbprintSecretName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Fingerprint className="mr-2 h-4 w-4 text-muted-foreground" />
                      Certificate Thumbprint (Secret Name in Key Vault)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Name of secret storing Certificate Thumbprint" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {watchedApiAuthMethod === "managedIdentityInKv" && (
              <>
                <FormField
                    control={form.control}
                    name={"managedIdentityClientIdSecretName" as any} 
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center">
                            <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                            User-Assigned MI Client ID (Secret Name in Key Vault)
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="Optional: Secret name for User-Assigned MI Client ID" {...field} />
                        </FormControl>
                        <FormDescription>
                            If the Azure API will be accessed by a User-Assigned Managed Identity, and its Client ID is stored in Key Vault, provide the secret name. Leave blank for System-Assigned MI or if Client ID is configured elsewhere.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <div className="p-3 bg-muted/30 rounded-md text-sm text-muted-foreground flex items-start">
                  <Info className="mr-2 h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    When using Managed Identity to access the Azure API, ensure the Managed Identity (System-Assigned or User-Assigned) for this application has the necessary permissions (e.g., 'Reader') on the target Azure resources.
                  </span>
                </div>
              </>
            )}

            <FormField
              control={form.control}
              name="subscriptionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                     <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
                    Azure Subscription ID to Monitor
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the Azure Subscription ID (UUID)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="apiEndpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-muted-foreground lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                    Azure API Endpoint (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., https://management.azure.com" {...field} />
                  </FormControl>
                   <FormDescription>
                    Defaults to the public Azure cloud endpoint if left blank.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-end">
            <Button type="submit" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
