import { Resend } from 'resend'
import { RESEND_API_KEY } from '$env/static/private';
import template from './templates/verifyEmail.html?raw';

const resend = new Resend(RESEND_API_KEY);

export type SendEmailInput = {
	to: string;
	subject: string;
	text: string;
};

const htmlString = template

console.log(htmlString);

export async function sendEmail(input: SendEmailInput): Promise<void> {
    await resend.emails.send({
        from: 'Sveltekit SPA <test@resend.dev>',
        to: input.to,
        subject: input.subject,
        html: template
    });
} 