import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email({ message: 'Please enter a valid email'}),
    password: z.string().min(1, 'Please enter your password'),
});

export const signupSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.email({ message: 'Please enter a valid email'}),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const resetPasswordSchema = z.object({
    email: z.email({ message: 'Please enter a valid email'})
})

export type LoginSchema = typeof loginSchema;
export type SignupSchema = typeof signupSchema;
export type ResetPasswordSchema = typeof resetPasswordSchema;