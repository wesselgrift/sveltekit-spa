/**
 * App feature flags and onboarding step definitions.
 * Centralizes toggleable behavior so auth guards and pages share one source.
 */

export const featureFlags = {
	enableOnboarding: true
} as const;

export type OnboardingFieldKey = 'favorite_fruit' | 'favorite_drink';

export interface OnboardingStepConfig {
	stepNumber: number;
	slug: string;
	title: string;
	subtext: string;
	fieldKey: OnboardingFieldKey;
	fieldLabel: string;
	fieldPlaceholder: string;
	submitLabel: string;
}

export const ONBOARDING_BASE_PATH = '/app/onboarding';

export const onboardingSteps: OnboardingStepConfig[] = [
	{
		stepNumber: 1,
		slug: 'step-1',
		title: "Let's setup your account",
		subtext: 'Tell us your favorite fruit so we can personalize your profile.',
		fieldKey: 'favorite_fruit',
		fieldLabel: 'Favorite fruit',
		fieldPlaceholder: 'e.g. Mango',
		submitLabel: 'Next'
	},
	{
		stepNumber: 2,
		slug: 'step-2',
		title: "You're almost done",
		subtext: 'One last detail: what is your favorite drink?',
		fieldKey: 'favorite_drink',
		fieldLabel: 'Favorite drink',
		fieldPlaceholder: 'e.g. Iced tea',
		submitLabel: 'Finish up'
	}
];

export const onboardingStepCount = onboardingSteps.length;

// Normalizes route paths so onboarding matching works with or without trailing slash.
function normalizePath(pathname: string): string {
	if (pathname.length > 1 && pathname.endsWith('/')) {
		return pathname.slice(0, -1);
	}

	return pathname;
}

export function getOnboardingStepByNumber(stepNumber: number): OnboardingStepConfig | undefined {
	return onboardingSteps.find((step) => step.stepNumber === stepNumber);
}

export function getOnboardingStepPath(stepNumber: number): string {
	const step = getOnboardingStepByNumber(stepNumber);
	const slug = step?.slug ?? onboardingSteps[0]?.slug ?? 'step-1';
	return `${ONBOARDING_BASE_PATH}/${slug}`;
}

export function getOnboardingStepByPath(pathname: string): OnboardingStepConfig | undefined {
	const normalizedPath = normalizePath(pathname);
	return onboardingSteps.find(
		(step) => normalizedPath === normalizePath(`${ONBOARDING_BASE_PATH}/${step.slug}`)
	);
}
