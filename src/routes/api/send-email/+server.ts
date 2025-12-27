import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/server/email/sendEmail.server';
import { auth } from '$lib/server/firebase/admin.server';
import { sendEmailSchema } from '$lib/server/email/validation';

export async function POST({ request, request: { headers } }) {
	try {
		// Verify authentication
		const authHeader = headers.get('authorization');
		if (!authHeader?.startsWith('Bearer ')) {
			return json({ ok: false, message: 'Unauthorized' }, { status: 401 });
		}

		const idToken = authHeader.split(' ')[1];
		const decodedToken = await auth.verifyIdToken(idToken);
		
		// Get and validate payload
		const rawPayload = await request.json();
		const validationResult = sendEmailSchema.safeParse(rawPayload);
		
		if (!validationResult.success) {
			// Return validation errors in a user-friendly format
			// Zod v4 uses 'issues' instead of 'errors'
			const errors = validationResult.error.issues.map((issue) => ({
				field: issue.path.join('.'),
				message: issue.message
			}));
			
			return json(
				{ 
					ok: false, 
					message: 'Invalid request data',
					errors 
				}, 
				{ status: 400 }
			);
		}

		const payload = validationResult.data;

		// Security: Only allow sending emails to the authenticated user's email
		// This prevents email spoofing and unauthorized sending
		if (payload.to !== decodedToken.email) {
			return json(
				{ 
					ok: false, 
					message: 'You can only send emails to your own email address' 
				}, 
				{ status: 403 }
			);
		}

		// Send email with validated payload
		await sendEmail(payload);

		return json({
			ok: true,
			message: 'Email sent successfully'
		});
	} catch (err) {
		console.error('❌ Error sending email:', err);
		
		// Don't leak internal error details to client
		const message = err instanceof Error && err.message.includes('template')
			? 'Email template error'
			: 'Failed to send email';
			
		return json({ ok: false, message }, { status: 500 });
	}
}