/**
 * Firestore Users Service
 *
 * Handles user document operations in Firestore.
 * User documents are stored in the `users` collection with the UID as document ID.
 */

import { doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { User } from 'firebase/auth';

// User document structure in Firestore
export interface UserDocument {
	uid: string;
	displayName: string;
	email: string;
	createdAt: ReturnType<typeof serverTimestamp>;
	emailVerified: boolean;
}

// Creates a new user document in Firestore after signup.
// Should be called immediately after successful Firebase Auth user creation.
// Stores UID, display name, email, creation timestamp, and emailVerified status.
export async function createUserDocument(user: User): Promise<void> {
	const userRef = doc(db, 'users', user.uid);

	await setDoc(userRef, {
		uid: user.uid,
		displayName: user.displayName ?? '',
		email: user.email ?? '',
		createdAt: serverTimestamp(),
		emailVerified: false
	});
}

// Updates the emailVerified field to true in the user's Firestore document.
// Should be called when the user successfully verifies their email.
export async function updateUserEmailVerified(uid: string): Promise<void> {
	const userRef = doc(db, 'users', uid);

	await updateDoc(userRef, {
		emailVerified: true
	});
}

// Deletes the user's document from Firestore.
// Should be called before deleting the Firebase Auth user to ensure cleanup.
export async function deleteUserDocument(uid: string): Promise<void> {
	const userRef = doc(db, 'users', uid);
	await deleteDoc(userRef);
}

