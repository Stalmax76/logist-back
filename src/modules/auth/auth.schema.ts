import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email().trim().toLowerCase(),
	password: z.string().min(6),
});

export const forgotPasswordSchema = z
	.object({
		email: z.string().email().trim().toLowerCase().optional(),
		phone: z.string().optional(),
	})
	.refine((data) => data.email || data.phone, 'Email or phone is required');

export const resetPasswordSchema = z.object({
	token: z.string(),
	password: z.string().min(6),
});

export const changePasswordSchema = z.object({
	old_password: z.string().min(6),
	new_password: z.string().min(6).max(255).trim(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
