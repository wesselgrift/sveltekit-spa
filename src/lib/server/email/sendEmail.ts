import { Resend } from 'resend'
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export type SendEmailInput = {
	to: string;
	subject: string;
	text: string;
};

export async function sendEmail(input: SendEmailInput): Promise<void> {
	console.log('✉️ LIB: sendEmail called with:', input);

	try {
		const result = await resend.emails.send({
			from: 'Sveltekit SPA <noreply@yourdomain.com>',
			to: input.to,
			subject: input.subject,
			text: input.text
		});

		console.log('✅ Email sent successfully:', result);
	} catch (err) {
		console.error('❌ Failed to send email:', err);

		throw new Error(`Email sending failed: ${(err as Error).message}`);
	}
} 