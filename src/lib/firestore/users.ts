/**
 * Firestore Users Service
 *
 * Handles user document operations in Firestore.
 * User documents are stored in the `users` collection with the UID as document ID.
 */

import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { User } from 'firebase/auth';

// User document structure in Firestore
export interface UserDocument {
	createdAt: ReturnType<typeof serverTimestamp>;
}

// Creates a new user document in Firestore after signup.
// Should be called immediately after successful Firebase Auth user creation.
// Stores only the creation timestamp - user data is available from Firebase Auth.
export async function createUserDocument(user: User): Promise<void> {
	const userRef = doc(db, 'users', user.uid);

	await setDoc(userRef, {
		createdAt: serverTimestamp()
	});
}

// Deletes the user's document from Firestore.
// Should be called before deleting the Firebase Auth user to ensure cleanup.
export async function deleteUserDocument(uid: string): Promise<void> {
	const userRef = doc(db, 'users', uid);
	await deleteDoc(userRef);
}

