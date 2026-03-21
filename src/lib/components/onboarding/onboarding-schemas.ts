import { z } from 'zod';

export const onboardingStepOneSchema = z.object({
	favoriteFruit: z.string().trim().min(1, 'Please enter your favorite fruit').max(255, 'Value is too long')
});

export const onboardingStepTwoSchema = z.object({
	favoriteDrink: z.string().trim().min(1, 'Please enter your favorite drink').max(255, 'Value is too long')
});

export type OnboardingStepOneSchema = typeof onboardingStepOneSchema;
export type OnboardingStepTwoSchema = typeof onboardingStepTwoSchema;
