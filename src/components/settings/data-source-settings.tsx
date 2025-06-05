
"use client";

import React, { useState } from "react";
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Archive, KeySquare, Building, KeyRound, Fingerprint, ListFilter, Save, Info, PlusCircle, Trash2, Server } from "lucide-react";

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
const singleDataSourceSchema = z.discriminatedUnion("apiAuthMethod", [
  clientSecretFromKvSchema,
  clientCertificateFromKvSchema,
  managedIdentitySchema,
]);
type SingleDataSourceFormData = z.infer<typeof singleDataSourceSchema>;

// Top-level schema for multiple configurations
const multipleDataSourcesSchema = z.object({
  configurations: z.array(singleDataSourceSchema).min(1, "At least one data source configuration is required."),
});
type MultipleDataSourcesFormData = z.infer<typeof multipleDataSourcesSchema>;


const defaultNewConfiguration: SingleDataSourceFormData = {
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


export function DataSourceSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<MultipleDataSourcesFormData>({
    resolver: zodResolver(multipleDataSourcesSchema),
    defaultValues: {
      configurations: [JSON.parse(JSON.stringify(defaultNewConfiguration))], // Deep copy
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "configurations",
  });

  const onSubmit: SubmitHandler<MultipleDataSourcesFormData> = async (data) => {
    setIsLoading(true);
    console.log("Saving Multiple Azure Data Source Settings:", data.configurations);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Settings Saved",
      description: `Successfully saved ${data.configurations.length} Azure data source configuration(s).`,
    });
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Server className="mr-2 h-5 w-5 text-primary" />
          Azure Data Source Configurations
        </CardTitle>
        <CardDescription>
          Manage configurations for multiple Azure subscriptions. Credentials will be fetched from Azure Key Vault.
          The application must have permissions (e.g., via Managed Identity) to access the specified Key Vaults.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <Accordion type="multiple" className="w-full space-y-4">
              {fields.map((field, index) => {
                const watchedApiAuthMethod = form.watch(`configurations.${index}.apiAuthMethod`);
                const watchedSubscriptionId = form.watch(`configurations.${index}.subscriptionId`);
                const watchedConfigName = form.watch(`configurations.${index}.configName`);
                const triggerTitle = watchedConfigName || watchedSubscriptionId || `Configuration ${index + 1}`;

                return (
                  <AccordionItem value={`item-${index}`} key={field.id} className="border bg-card p-0 rounded-lg shadow-sm">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline data-[state=open]:border-b">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-md">{triggerTitle}</span>
                         {fields.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10 h-8 w-8"
                                onClick={(e) => {
                                e.stopPropagation(); // Prevent accordion toggle
                                remove(index);
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove Configuration</span>
                            </Button>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-2 space-y-6 border-t-0">
                       <FormField
                        control={form.control}
                        name={`configurations.${index}.configName`}
                        render={({ field: configNameField }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                              Configuration Name (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Prod Subscription A Monitoring" {...configNameField} />
                            </FormControl>
                            <FormDescription>A friendly name to identify this configuration.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`configurations.${index}.keyVaultUri`}
                        render={({ field: kvField }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Archive className="mr-2 h-4 w-4 text-muted-foreground" />
                              Azure Key Vault URI
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., https://your-keyvault-name.vault.azure.net/" {...kvField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`configurations.${index}.apiAuthMethod`}
                        render={({ field: authMethodField }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <KeySquare className="mr-2 h-4 w-4 text-muted-foreground" />
                              Azure API Authentication Method (Credentials from Key Vault)
                            </FormLabel>
                            <Select onValueChange={authMethodField.onChange} defaultValue={authMethodField.value}>
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
                              Determines credential type fetched from Key Vault for Azure API authentication.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {(watchedApiAuthMethod === "clientSecretInKv" || watchedApiAuthMethod === "clientCertificateInKv") && (
                        <>
                          <FormField
                            control={form.control}
                            name={`configurations.${index}.tenantIdSecretName`}
                            render={({ field: itemField }) => (
                              <FormItem>
                                <FormLabel className="flex items-center">
                                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                                  Tenant ID (Secret Name in Key Vault)
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Name of secret storing Tenant ID" {...itemField} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`configurations.${index}.clientIdSecretName`}
                            render={({ field: itemField }) => (
                              <FormItem>
                                <FormLabel className="flex items-center">
                                  <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                                  Client ID (Secret Name in Key Vault)
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Name of secret storing Client ID" {...itemField} />
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
                          name={`configurations.${index}.clientSecretName`}
                          render={({ field: itemField }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                                Client Secret (Secret Name in Key Vault)
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Name of secret storing Client Secret" {...itemField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {watchedApiAuthMethod === "clientCertificateInKv" && (
                        <FormField
                          control={form.control}
                          name={`configurations.${index}.certificateThumbprintSecretName`}
                          render={({ field: itemField }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Fingerprint className="mr-2 h-4 w-4 text-muted-foreground" />
                                Certificate Thumbprint (Secret Name in Key Vault)
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Name of secret storing Certificate Thumbprint" {...itemField} />
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
                              name={`configurations.${index}.managedIdentityClientIdSecretName`}
                              render={({ field: itemField }) => (
                                  <FormItem>
                                  <FormLabel className="flex items-center">
                                      <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                                      User-Assigned MI Client ID (Secret Name in Key Vault)
                                  </FormLabel>
                                  <FormControl>
                                      <Input placeholder="Optional: Secret name for User-Assigned MI Client ID" {...itemField} />
                                  </FormControl>
                                  <FormDescription>
                                      If Azure API is accessed by User-Assigned MI, and its Client ID is in Key Vault, provide secret name. Leave blank for System-Assigned MI or if Client ID is configured elsewhere.
                                  </FormDescription>
                                  <FormMessage />
                                  </FormItem>
                              )}
                              />
                          <div className="p-3 bg-muted/30 rounded-md text-sm text-muted-foreground flex items-start">
                            <Info className="mr-2 h-4 w-4 shrink-0 mt-0.5" />
                            <span>
                              When using Managed Identity to access the Azure API, ensure this application's MI has 'Reader' on target resources and 'Get Secrets' on the Key Vault.
                            </span>
                          </div>
                        </>
                      )}

                      <FormField
                        control={form.control}
                        name={`configurations.${index}.subscriptionId`}
                        render={({ field: itemField }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                               <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
                              Azure Subscription ID to Monitor
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter the Azure Subscription ID (UUID)" {...itemField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name={`configurations.${index}.apiEndpoint`}
                        render={({ field: itemField }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-muted-foreground lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                              Azure API Endpoint (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., https://management.azure.com" {...itemField} />
                            </FormControl>
                             <FormDescription>
                              Defaults to the public Azure cloud endpoint if left blank.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
            <Button 
              type="button" 
              variant="outline" 
              className="mt-4"
              onClick={() => append(JSON.parse(JSON.stringify(defaultNewConfiguration)))} // Deep copy
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Subscription Configuration
            </Button>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-end">
            <Button type="submit" disabled={isLoading || fields.length === 0}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save All Configurations"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

    