import { z } from 'zod';

export const createUserSchema = z.object({
	first_name: z.string().trim().min(1).max(100),
	last_name: z.string().trim().min(1).max(100),
	email: z.string().trim().email().max(100),
	phone: z.string().trim().max(30).optional(),
	password: z.string().trim().min(4).max(100),
	role: z.enum(['driver', 'manager']).default('driver'),
	is_active: z.boolean().default(true),
});
export const updateUserSchema = createUserSchema.partial();

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
