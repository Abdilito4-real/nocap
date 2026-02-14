'use server';
/**
 * @fileOverview An AI assistant for breaking down and planning assignments.
 *
 * - assistWithAssignment - A function that provides sub-tasks, resources, and time estimates for an assignment.
 * - AssistAssignmentInput - The input type for the assistWithAssignment function.
 * - AssistAssignmentOutput - The return type for the assistWithAssignment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssistAssignmentInputSchema = z.object({
  title: z.string().describe('The title of the assignment.'),
  courseCode: z.string().describe('The course code for the assignment.'),
});
export type AssistAssignmentInput = z.infer<typeof AssistAssignmentInputSchema>;

const AssistAssignmentOutputSchema = z.object({
  subTasks: z.array(z.string()).describe('A list of smaller, actionable sub-tasks to complete the assignment.'),
  suggestedResources: z.array(z.string()).describe('A list of topics, keywords, or concepts to search for online to help with the assignment.'),
  timeEstimate: z.string().describe('A rough estimate of how long the assignment might take, e.g., "3-5 hours".'),
});
export type AssistAssignmentOutput = z.infer<typeof AssistAssignmentOutputSchema>;

export async function assistWithAssignment(input: AssistAssignmentInput): Promise<AssistAssignmentOutput> {
  return assistAssignmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistAssignmentPrompt',
  input: {schema: AssistAssignmentInputSchema},
  output: {schema: AssistAssignmentOutputSchema},
  prompt: `You are an expert academic assistant AI. Your goal is to help a student plan and tackle their university assignments.

Given the following assignment details, provide a helpful breakdown.

Course: {{{courseCode}}}
Assignment: {{{title}}}

Based on this, please do the following:
1. Break the assignment down into 3-5 smaller, actionable sub-tasks.
2. Suggest a few relevant topics or keywords the student could search for to find helpful online resources.
3. Provide a rough time estimate for completing the assignment.`,
});

const assistAssignmentFlow = ai.defineFlow(
  {
    name: 'assistAssignmentFlow',
    inputSchema: AssistAssignmentInputSchema,
    outputSchema: AssistAssignmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get assignment assistance from AI.');
    }
    return output;
  }
);
