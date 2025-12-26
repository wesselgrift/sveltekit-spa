import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/server/email/sendEmail.server';
import { auth } from '$lib/server/firebase/admin.server';

export async function POST ({request, request: {headers}}) {
    try {
        const authHeader = headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
			return json({ ok: false, message: 'Unauthorized' }, { status: 401 });
		}
        const idToken = authHeader.split(' ')[1];
		const decoded = await auth.verifyIdToken(idToken);

		console.log('✅ Verified user UID:', decoded.uid);
        
        const payload = await request.json();
    
        await sendEmail(payload);
    
        return json({
            ok: true
        });
    } catch(err) {
        console.error('❌ Error sending email:', err);
		return json({ ok: false, message: 'Unauthorized or failed' }, { status: 401 });
    }


}

