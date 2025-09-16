'use server';

/**
 * @fileOverview AI-powered business category suggestion flow.
 *
 * This file defines a Genkit flow that suggests relevant business categories
 * based on a business description provided as input.
 *
 * - suggestBusinessCategories - A function that suggests business categories based on a description.
 * - SuggestBusinessCategoriesInput - The input type for the suggestBusinessCategories function.
 * - SuggestBusinessCategoriesOutput - The return type for the suggestBusinessCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBusinessCategoriesInputSchema = z.object({
  businessDescription: z
    .string()
    .describe('A detailed description of the business.'),
});
export type SuggestBusinessCategoriesInput = z.infer<
  typeof SuggestBusinessCategoriesInputSchema
>;

const SuggestBusinessCategoriesOutputSchema = z.object({
  suggestedCategories: z
    .array(z.string())
    .describe('An array of suggested business categories.'),
});
export type SuggestBusinessCategoriesOutput = z.infer<
  typeof SuggestBusinessCategoriesOutputSchema
>;

export async function suggestBusinessCategories(
  input: SuggestBusinessCategoriesInput
): Promise<SuggestBusinessCategoriesOutput> {
  return suggestBusinessCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBusinessCategoriesPrompt',
  input: {schema: SuggestBusinessCategoriesInputSchema},
  output: {schema: SuggestBusinessCategoriesOutputSchema},
  prompt: `You are a helpful assistant that suggests business categories based on a given business description.

  Given the following business description, suggest a list of relevant business categories.

  Description: {{{businessDescription}}}

  Respond with a JSON array of strings.  For example: ["Category 1", "Category 2", "Category 3"]`,
});

const suggestBusinessCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestBusinessCategoriesFlow',
    inputSchema: SuggestBusinessCategoriesInputSchema,
    outputSchema: SuggestBusinessCategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
