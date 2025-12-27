/**
 * Server-side email sending via Resend.
 * Uses validated input from the API endpoint.
 * 
 * Templates are imported at build time using Vite's ?raw suffix,
 * which bundles them directly into the code. This approach:
 * - Works in all deployment targets (Vercel, Cloudflare, etc.)
 * - Requires no file system access at runtime
 * - Ensures templates are always available in production
 */

import { Resend } from 'resend'
import { RESEND_API_KEY } from '$env/static/private';
import type { SendEmailInput } from './validation';

// Import all templates at build time using Vite's ?raw suffix
// This bundles the HTML content directly into the code
import welcomeHtml from './templates/welcome.html?raw';
import verifyEmailHtml from './templates/verifyEmail.html?raw';
import passwordResetHtml from './templates/passwordReset.html?raw';
import passwordSetHtml from './templates/passwordSet.html?raw';
import passwordChangedHtml from './templates/passwordChanged.html?raw';
import emailChangedHtml from './templates/emailChanged.html?raw';
import emailChangeVerificationHtml from './templates/emailChangeVerification.html?raw';
import accountDeletedHtml from './templates/accountDeleted.html?raw';

const resend = new Resend(RESEND_API_KEY);

// Map template names to their imported content
// Keys must match ALLOWED_TEMPLATES in validation.ts
const templates: Record<string, string> = {
	welcome: welcomeHtml,
	verifyEmail: verifyEmailHtml,
	passwordReset: passwordResetHtml,
	passwordSet: passwordSetHtml,
	passwordChanged: passwordChangedHtml,
	emailChanged: emailChangedHtml,
	emailChangeVerification: emailChangeVerificationHtml,
	accountDeleted: accountDeletedHtml
};

function loadTemplate(
	templateName: string,
	variables: Record<string, string | number> = {}
): string {
	const html = templates[templateName];

	if (!html) {
		throw new Error(`Email template not found: ${templateName}`);
	}

	// Simple variable replacement: {{key}}
	let result = html;
	for (const [key, value] of Object.entries(variables)) {
		const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
		result = result.replace(pattern, String(value));
	}

	return result;
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
    const html = loadTemplate(input.template, input.variables);

    await resend.emails.send({
        from: 'Sveltekit SPA <test@resend.dev>',
        to: input.to,
        subject: input.subject,
        html: html
    });
} 