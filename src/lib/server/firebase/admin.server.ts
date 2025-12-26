import admin from 'firebase-admin';
import { FIREBASE_ADMIN_CERT } from '$env/static/private';

if (!admin.apps.length) {
	const serviceAccount = JSON.parse(FIREBASE_ADMIN_CERT);
	serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount)
	});
}

export const auth = admin.auth();