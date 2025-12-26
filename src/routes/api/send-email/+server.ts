import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/server/email/sendEmail';

export async function POST ({request}) {
    console.log('🟢 API: /api/send-email called');

	const payload = await request.json();

    await sendEmail(payload);

	return json({
		ok: true,
		message: 'Mock email sent (check server logs)'
	});
}

