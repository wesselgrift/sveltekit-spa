/**
 * Server-side email sending via Resend.
 * Uses validated input from the API endpoint.
 */

import { Resend } from 'resend'
import { RESEND_API_KEY } from '$env/static/private';
import fs from 'fs';
import path from 'path';
import type { SendEmailInput } from './validation';

const resend = new Resend(RESEND_API_KEY);

function loadTemplate(
	templateName: string,
	variables: Record<string, string | number> = {}
): string {
	const templatePath = path.resolve(
		'src/lib/server/email/templates',
		`${templateName}.html`
	);

	if (!fs.existsSync(templatePath)) {
		throw new Error(`Email template not found: ${templateName}`);
	}

	let html = fs.readFileSync(templatePath, 'utf-8');

	// Simple variable replacement: {{key}}
	for (const [key, value] of Object.entries(variables)) {
		const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
		html = html.replace(pattern, String(value));
	}

	return html;
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