'use server';
/**
 * @fileOverview Generates remediation steps and exception requests for a non-compliant Azure policy.
 *
 * - generateRemediationSteps - A function that generates remediation steps and exception requests.
 * - GenerateRemediationStepsInput - The input type for the generateRemediationSteps function.
 * - GenerateRemediationStepsOutput - The return type for the generateRemediationSteps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRemediationStepsInputSchema = z.object({
  policyDefinition: z
    .string()
    .describe('The definition of the non-compliant Azure policy.'),
  resourceDetails: z
    .string()
    .describe('Details about the non-compliant resource.'),
});
export type GenerateRemediationStepsInput = z.infer<
  typeof GenerateRemediationStepsInputSchema
>;

const GenerateRemediationStepsOutputSchema = z.object({
  remediationSteps: z
    .string()
    .describe('AI-generated steps to remediate the non-compliant policy.'),
  exceptionRequest: z
    .string()
    .describe('Suggested exception request for the non-compliant policy.'),
});
export type GenerateRemediationStepsOutput = z.infer<
  typeof GenerateRemediationStepsOutputSchema
>;

export async function generateRemediationSteps(
  input: GenerateRemediationStepsInput
): Promise<GenerateRemediationStepsOutput> {
  return generateRemediationStepsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRemediationStepsPrompt',
  input: {schema: GenerateRemediationStepsInputSchema},
  output: {schema: GenerateRemediationStepsOutputSchema},
  prompt: `You are an AI assistant designed to help users remediate non-compliant Azure policies.

You will be given a policy definition and details about the non-compliant resource.

Based on this information, generate clear and concise remediation steps and a suggested exception request.

Policy Definition: {{{policyDefinition}}}
Resource Details: {{{resourceDetails}}}

Remediation Steps:
Exception Request:`,
});

const generateRemediationStepsFlow = ai.defineFlow(
  {
    name: 'generateRemediationStepsFlow',
    inputSchema: GenerateRemediationStepsInputSchema,
    outputSchema: GenerateRemediationStepsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
