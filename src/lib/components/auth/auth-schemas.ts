import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email({ message: 'Please enter a valid email'}),
    password: z.string().min(1, 'Please enter your password'),
});

export const signupSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(128, 'First name is too long'),
    lastName: z.string().min(1, 'Last name is required').max(128, 'Last name is too long'),
    email: z.email({ message: 'Please enter a valid email'}),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const resetPasswordSchema = z.object({
    email: z.email({ message: 'Please enter a valid email'})
})

export const setNewPasswordSchema = z
	.object({
		newPassword: z.string().min(6, 'Password must be at least 6 characters'),
		confirmNewPassword: z.string().min(1, 'Please confirm your new password')
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: 'Passwords do not match',
		path: ['confirmNewPassword']
	});

export type LoginSchema = typeof loginSchema;
export type SignupSchema = typeof signupSchema;
export type ResetPasswordSchema = typeof resetPasswordSchema;
export type SetNewPasswordSchema = typeof setNewPasswordSchema;