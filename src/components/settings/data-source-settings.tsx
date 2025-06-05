
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
import { HardDrive, KeyRound, Building, ListFilter, Save, Fingerprint, KeySquare } from "lucide-react";

const baseSchema = z.object({
  subscriptionId: z.string().uuid("Invalid Subscription ID format. Must be a UUID."),
  apiEndpoint: z.string().url("Invalid API Endpoint URL.").optional().or(z.literal('')),
});

const clientSecretAuthSchema = baseSchema.extend({
  authMethod: z.literal("clientSecret"),
  tenantId: z.string().uuid("Invalid Tenant ID format. Must be a UUID."),
  clientId: z.string().uuid("Invalid Client ID format. Must be a UUID."),
  clientSecret: z.string().min(1, "Client Secret is required."),
});

const clientCertificateAuthSchema = baseSchema.extend({
  authMethod: z.literal("clientCertificate"),
  tenantId: z.string().uuid("Invalid Tenant ID format. Must be a UUID."),
  clientId: z.string().uuid("Invalid Client ID format. Must be a UUID."),
  certificateThumbprint: z.string().regex(/^[a-fA-F0-9]{40}$/, "Invalid Certificate Thumbprint format. Must be a 40-character hex string."),
});

const managedIdentityAuthSchema = baseSchema.extend({
  authMethod: z.literal("managedIdentity"),
  clientId: z.string().uuid("Invalid Client ID format. Must be a UUID.").optional().or(z.literal('')).describe("Optional: Client ID of the User-Assigned Managed Identity."),
});

const dataSourceSchema = z.discriminatedUnion("authMethod", [
  clientSecretAuthSchema,
  clientCertificateAuthSchema,
  managedIdentityAuthSchema,
]);

type DataSourceFormData = z.infer<typeof dataSourceSchema>;

export function DataSourceSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<DataSourceFormData>({
    resolver: zodResolver(dataSourceSchema),
    defaultValues: {
      authMethod: "clientSecret",
      tenantId: "",
      clientId: "",
      clientSecret: "",
      subscriptionId: "",
      apiEndpoint: "https://management.azure.com",
      certificateThumbprint: "",
    },
  });

  const watchedAuthMethod = form.watch("authMethod");

  const onSubmit: SubmitHandler<DataSourceFormData> = async (data) => {
    setIsLoading(true);
    console.log("Saving data source settings:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Settings Saved",
      description: "Azure REST API data source settings have been saved.",
    });
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <HardDrive className="mr-2 h-5 w-5 text-primary" />
          Azure Data Source Configuration
        </CardTitle>
        <CardDescription>
          Configure how this application authenticates with the Azure REST API to fetch compliance data.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="authMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <KeySquare className="mr-2 h-4 w-4 text-muted-foreground" />
                    Authentication Method
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an authentication method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="clientSecret">Client Secret</SelectItem>
                      <SelectItem value="clientCertificate">Client Certificate</SelectItem>
                      <SelectItem value="managedIdentity">Managed Identity</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(watchedAuthMethod === "clientSecret" || watchedAuthMethod === "clientCertificate") && (
              <>
                <FormField
                  control={form.control}
                  name="tenantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                        Tenant ID
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Azure Tenant ID (UUID)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                        Client ID (Application ID)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Azure App Registration Client ID (UUID)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {watchedAuthMethod === "clientSecret" && (
              <FormField
                control={form.control}
                name="clientSecret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                      Client Secret
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your Azure App Registration Client Secret" {...field} />
                    </FormControl>
                    <FormDescription>
                      Client secrets are sensitive. Ensure this application is hosted securely.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchedAuthMethod === "clientCertificate" && (
              <FormField
                control={form.control}
                name="certificateThumbprint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Fingerprint className="mr-2 h-4 w-4 text-muted-foreground" />
                      Certificate Thumbprint
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the 40-character certificate thumbprint" {...field} />
                    </FormControl>
                    <FormDescription>
                      The thumbprint of the client certificate registered with the App Registration.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {watchedAuthMethod === "managedIdentity" && (
              <>
                <FormField
                    control={form.control}
                    // Cast is safe due to discriminated union structure; this field is only relevant here
                    name={"clientId" as any} 
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center">
                            <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                            Client ID (User-Assigned Managed Identity)
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="Optional: Client ID of User-Assigned MI" {...field} />
                        </FormControl>
                        <FormDescription>
                            Leave blank for System-Assigned Managed Identity. Provide the Client ID for User-Assigned Managed Identity.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <div className="p-4 bg-muted/50 rounded-md text-sm text-muted-foreground">
                  When using Managed Identity, Azure securely manages the credentials. Ensure this application is hosted in an Azure service that supports Managed Identities (e.g., App Service, Azure Functions, VMs) and that the Managed Identity has appropriate permissions.
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
                    Subscription ID
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the Azure Subscription ID to monitor (UUID)" {...field} />
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

