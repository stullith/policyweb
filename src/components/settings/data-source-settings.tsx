
"use client";

import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { HardDrive, KeyRound, Building, ListFilter, Save } from "lucide-react";

const dataSourceSchema = z.object({
  tenantId: z.string().uuid("Invalid Tenant ID format. Must be a UUID."),
  clientId: z.string().uuid("Invalid Client ID format. Must be a UUID."),
  clientSecret: z.string().min(1, "Client Secret is required."),
  subscriptionId: z.string().uuid("Invalid Subscription ID format. Must be a UUID."),
  apiEndpoint: z.string().url("Invalid API Endpoint URL.").optional().or(z.literal('')),
});

type DataSourceFormData = z.infer<typeof dataSourceSchema>;

export function DataSourceSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<DataSourceFormData>({
    resolver: zodResolver(dataSourceSchema),
    defaultValues: {
      tenantId: "",
      clientId: "",
      clientSecret: "",
      subscriptionId: "",
      apiEndpoint: "https://management.azure.com", // Default Azure API endpoint
    },
  });

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
    // In a real app, you would save these settings securely.
    // For this prototype, we're just logging and showing a toast.
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <HardDrive className="mr-2 h-5 w-5 text-primary" />
          Azure Data Source Configuration
        </CardTitle>
        <CardDescription>
          Enter the details for connecting to the Azure REST API. These credentials will be used to fetch compliance data.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
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
