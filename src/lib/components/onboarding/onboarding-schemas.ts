import { z } from 'zod';

export const onboardingStepOneSchema = z.object({
	favoriteFruit: z.string().trim().min(1, 'Please enter your favorite fruit')
});

export const onboardingStepTwoSchema = z.object({
	favoriteDrink: z.string().trim().min(1, 'Please enter your favorite drink')
});

export type OnboardingStepOneSchema = typeof onboardingStepOneSchema;
export type OnboardingStepTwoSchema = typeof onboardingStepTwoSchema;
