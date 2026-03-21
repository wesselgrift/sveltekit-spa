/**
 * Onboarding service — business logic for the multi-step onboarding flow.
 * Sits between route components and the profile repository (profiles.ts).
 * Returns Result<T> so callers handle success/failure without try/catch.
 */

import {
	getCurrentUserProfile,
	updateCurrentUserProfile,
	type UserProfile
} from '$lib/supabase/profiles';
import { onboardingStepCount, type OnboardingFieldKey } from '$lib/config/features';
import type { Result } from '$lib/types/result';

// Returns true when onboarding has explicitly been marked complete.
export function isOnboardingComplete(profile: UserProfile | null): boolean {
	return Boolean(profile?.onboarding_completed_at);
}

// Computes the next required onboarding step, clamped to the configured range.
export function getNextOnboardingStep(profile: UserProfile | null): number {
	if (!profile) {
		return 1;
	}

	if (isOnboardingComplete(profile)) {
		return onboardingStepCount;
	}

	const savedStep = profile.onboarding_step ?? 0;
	return Math.min(Math.max(savedStep + 1, 1), onboardingStepCount);
}

export interface OnboardingStatus {
	complete: boolean;
	nextStep: number;
	profile: UserProfile | null;
}

// Fetches the user's profile and computes their onboarding status.
// Used by the protected layout to gate access and by the onboarding index to redirect.
export async function getOnboardingStatus(): Promise<Result<OnboardingStatus>> {
	try {
		const profile = await getCurrentUserProfile();
		const complete = isOnboardingComplete(profile);
		const nextStep = getNextOnboardingStep(profile);

		return { ok: true, data: { complete, nextStep, profile } };
	} catch {
		return { ok: false, error: 'We could not load your onboarding status. Refresh the page and try again.' };
	}
}

export interface StepPrefill {
	prefillValue: string | null;
	isCorrectStep: boolean;
	requiredStep: number;
}

// Loads the user's profile to prefill a step form and verify they belong on this step.
// Returns the existing field value (if any) and whether the user is on the correct step.
export async function prefillStep(
	stepNumber: number,
	fieldKey: OnboardingFieldKey
): Promise<Result<StepPrefill>> {
	try {
		const profile = await getCurrentUserProfile();
		const requiredStep = getNextOnboardingStep(profile);
		const prefillValue = (profile?.[fieldKey] as string | null | undefined) ?? null;

		return {
			ok: true,
			data: {
				prefillValue,
				isCorrectStep: requiredStep === stepNumber,
				requiredStep
			}
		};
	} catch {
		return { ok: false, error: 'We could not load your onboarding data. Please refresh and try again.' };
	}
}

// Persists one onboarding step field and marks progress.
export async function saveStep(
	stepNumber: number,
	field: OnboardingFieldKey,
	value: string
): Promise<Result<void>> {
	try {
		await updateCurrentUserProfile({
			[field]: value,
			onboarding_step: stepNumber
		});

		return { ok: true, data: undefined };
	} catch {
		return { ok: false, error: 'We could not save your answer. Please try again.' };
	}
}

// Completes onboarding with the final step value and a completion timestamp.
export async function finishOnboarding(finalValue: string): Promise<Result<void>> {
	try {
		await updateCurrentUserProfile({
			favorite_drink: finalValue,
			onboarding_step: onboardingStepCount,
			onboarding_completed_at: new Date().toISOString()
		});

		return { ok: true, data: undefined };
	} catch {
		return { ok: false, error: 'We could not finish onboarding. Please try again.' };
	}
}
