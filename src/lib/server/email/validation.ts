/**
 * Email API Validation Schema
 * 
 * Validates incoming email requests to prevent:
 * - Template path traversal attacks
 * - Unauthorized email sending
 * - Malicious variable injection
 * - Invalid payload structure
 */

import { z } from 'zod';

// Whitelist of allowed email templates
// Only templates in this list can be used
const ALLOWED_TEMPLATES = [
	'welcome',
	'verifyEmail',
	'passwordReset',
	'passwordSet',
	'passwordChanged',
	'emailChanged',
	'emailChangeVerification',
	'accountDeleted'
] as const;

// Schema for template variables
// Only allows string or number values to prevent injection
const templateVariablesSchema = z.record(
	z.string(), // variable key must be a string
	z.union([z.string(), z.number()]) // value must be string or number
).optional();

// Main email payload schema
export const sendEmailSchema = z.object({
	to: z.string()
		.email('Invalid email address')
		.max(255, 'Email address too long'),
	subject: z.string()
		.min(1, 'Subject is required')
		.max(200, 'Subject too long'),
	template: z.enum(ALLOWED_TEMPLATES, {
		message: 'Invalid template name'
	}),
	variables: templateVariablesSchema
});

export type SendEmailInput = z.infer<typeof sendEmailSchema>;

// Helper to get allowed templates (useful for error messages)
export function getAllowedTemplates(): readonly string[] {
	return ALLOWED_TEMPLATES;
}