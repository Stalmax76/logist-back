import { z } from 'zod';

// Нормалізація імені
const normalizeName = (val: string) =>
	val.trim().charAt(0).toUpperCase() + val.trim().slice(1).toLowerCase();

// Валідація телефону
const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

export const createUserSchema = z.object({
	first_name: z.string().min(1).max(100).transform(normalizeName),
	last_name: z.string().min(1).max(100).transform(normalizeName),
	phone: z.string().max(50).regex(phoneRegex, 'Invalid phone format').optional(),
	email: z.string().email().max(255).trim().toLowerCase(),
	password: z.string().min(6).max(100).trim(),
	role: z.enum(['driver', 'manager']).default('driver'),
	is_active: z.boolean().default(true),
});
export const updateUserSchema = z.object({
	first_name: z.string().max(100).transform(normalizeName).optional(),
	last_name: z.string().max(100).transform(normalizeName).optional(),
	phone: z.string().max(50).regex(phoneRegex, 'Invalid phone format').optional(),
	email: z.string().email().max(255).trim().toLowerCase().optional(),
	password: z.string().min(6).max(255).trim().optional(),
	role: z.enum(['admin', 'driver', 'manager']).optional(),
	is_active: z.boolean().optional(),
});

// Валідація логіну
export const loginSchema = z.object({
	email: z.string().email().trim().toLowerCase(),
	password: z.string().min(6),
});

// Забув пароль
export const forgotPasswordSchema = z.object({
	email: z.string().email().trim().toLowerCase(),
});

// Зміна пароля
export const changePasswordSchema = z.object({
	old_password: z.string().min(6),
	new_password: z.string().min(6).max(255).trim(),
});

// Активація / деактивація
export const toggleUserActivateSchema = z.object({
	is_active: z.boolean(),
});

// Відповідь одного користувача
export const userResponseSchema = z.object({
	id: z.number(),
	first_name: z.string(),
	last_name: z.string(),
	phone: z.string().nullable(),
	email: z.string(),
	role: z.enum(['admin', 'driver', 'manager']),
	is_active: z.boolean(),
	created_at: z.string(),
	updated_at: z.string(),
	deleted_at: z.string().nullable(),
});

// Відповідь всіх користувачів
export const usersListResponseSchema = z.array(userResponseSchema);

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type ToggleUserActivateDto = z.infer<typeof toggleUserActivateSchema>;
