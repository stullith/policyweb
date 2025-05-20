"use client";

import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2, Copy, Check } from "lucide-react";
import { generateRemediationSteps, type GenerateRemediationStepsInput, type GenerateRemediationStepsOutput } from "@/ai/flows/generate-remediation-steps";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const remediationSchema = z.object({
  policyDefinition: z.string().min(10, "Policy definition is too short.").max(5000, "Policy definition is too long."),
  resourceDetails: z.string().min(10, "Resource details are too short.").max(5000, "Resource details are too long."),
});

type RemediationFormData = z.infer<typeof remediationSchema>;

export function RemediationAdvisor() {
  const [isLoading, setIsLoading] = useState(false);
  const [remediationOutput, setRemediationOutput] = useState<GenerateRemediationStepsOutput | null>(null);
  const [copiedStep, setCopiedStep] = useState(false);
  const [copiedException, setCopiedException] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RemediationFormData>({
    resolver: zodResolver(remediationSchema),
  });

  const onSubmit: SubmitHandler<RemediationFormData> = async (data) => {
    setIsLoading(true);
    setRemediationOutput(null);
    try {
      const input: GenerateRemediationStepsInput = {
        policyDefinition: data.policyDefinition,
        resourceDetails: data.resourceDetails,
      };
      const result = await generateRemediationSteps(input);
      setRemediationOutput(result);
    } catch (error) {
      console.error("Error generating remediation steps:", error);
      toast({
        title: "Error",
        description: "Failed to generate remediation steps. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleCopy = async (text: string, type: 'steps' | 'exception') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'steps') setCopiedStep(true);
      else setCopiedException(true);
      
      setTimeout(() => {
        if (type === 'steps') setCopiedStep(false);
        else setCopiedException(false);
      }, 2000);

      toast({
        title: "Copied to clipboard!",
        description: `${type === 'steps' ? 'Remediation steps' : 'Exception request'} copied.`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Wand2 className="mr-2 h-5 w-5 text-primary" />
            Intelligent Remediation Guidance
          </CardTitle>
          <CardDescription>
            Provide policy and resource details to get AI-powered remediation steps and exception request drafts.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="policyDefinition">Non-Compliant Policy Definition</Label>
              <Textarea
                id="policyDefinition"
                placeholder="Paste the full JSON or relevant parts of the non-compliant Azure Policy definition here..."
                className="mt-1 min-h-[150px]"
                {...register("policyDefinition")}
              />
              {errors.policyDefinition && (
                <p className="text-sm text-destructive mt-1">{errors.policyDefinition.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="resourceDetails">Non-Compliant Resource Details</Label>
              <Textarea
                id="resourceDetails"
                placeholder="Describe the non-compliant resource. Include its type, ID, current configuration, and any relevant context..."
                className="mt-1 min-h-[150px]"
                {...register("resourceDetails")}
              />
              {errors.resourceDetails && (
                <p className="text-sm text-destructive mt-1">{errors.resourceDetails.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Guidance
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading && (
         <Card className="shadow-lg rounded-lg flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Generating guidance... this may take a moment.</p>
        </Card>
      )}

      {remediationOutput && !isLoading && (
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg">AI Generated Guidance</CardTitle>
            <CardDescription>Review the suggested steps and exception request below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="remediation-steps" className="w-full">
              <AccordionItem value="remediation-steps">
                <AccordionTrigger className="text-base font-medium">Remediation Steps</AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert p-2 bg-muted/50 rounded-md">
                    <pre className="whitespace-pre-wrap break-words text-sm p-2">{remediationOutput.remediationSteps}</pre>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(remediationOutput.remediationSteps, 'steps')} className="mt-2">
                    {copiedStep ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copiedStep ? "Copied!" : "Copy Steps"}
                  </Button>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="exception-request">
                <AccordionTrigger className="text-base font-medium">Exception Request Draft</AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert p-2 bg-muted/50 rounded-md">
                     <pre className="whitespace-pre-wrap break-words text-sm p-2">{remediationOutput.exceptionRequest}</pre>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(remediationOutput.exceptionRequest, 'exception')} className="mt-2">
                    {copiedException ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copiedException ? "Copied!" : "Copy Request"}
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">
              AI-generated content may require review and adjustment. Always verify steps before applying them to production environments.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
