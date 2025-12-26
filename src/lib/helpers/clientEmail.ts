import { getAuth } from 'firebase/auth';

export type SendEmailInput = {
	to: string;
	subject: string;
	text: string;
};

export type SendEmailResult = {
	ok: boolean;
	message: string;
};

/**
 * Sends an email via the /api/send-email endpoint.
 * Handles Firebase ID token automatically.
 * Returns a uniform result object, never throws.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
	const auth = getAuth();
	const user = auth.currentUser;
	if (!user) return { ok: false, message: 'User not logged in' };

	try {
		const token = await user.getIdToken();
		const res = await fetch('/api/send-email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(input)
		});

		if (!res.ok) {
			const data = await res.json().catch(() => ({}));
			return { ok: false, message: data?.message || 'Failed to send email' };
		}

		const data = await res.json();
		return { ok: true, message: data?.message || 'Email sent' };
	} catch (err) {
		console.error('Error sending email:', err);
		return { ok: false, message: 'Unexpected error' };
	}
}