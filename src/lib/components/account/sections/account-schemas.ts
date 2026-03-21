import { z } from 'zod';

export const nameSchema = z.object({
	firstName: z.string().min(1, 'First name is required').max(128, 'First name is too long'),
	lastName: z.string().min(1, 'Last name is required').max(128, 'Last name is too long'),
});

export const changeEmailSchema = z.object({
	newEmail: z.email({ message: 'Please enter a valid email' }),
	currentPassword: z.string().min(1, 'Please enter your current password'),
});

export const changePasswordSchema = z.object({
	currentPassword: z.string().min(1, 'Please enter your current password'),
	newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const deleteAccountSchema = z.object({
	password: z.string().min(1, 'Please enter your password'),
});

export type NameSchema = typeof nameSchema;
export type ChangeEmailSchema = typeof changeEmailSchema;
export type ChangePasswordSchema = typeof changePasswordSchema;
export type DeleteAccountSchema = typeof deleteAccountSchema;