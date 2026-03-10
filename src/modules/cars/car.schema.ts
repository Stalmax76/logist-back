import { z } from 'zod';

export const createCarSchema = z.object({
	plate: z
		.string()
		.max(20)
		.trim()
		.transform((val) => val.toUpperCase()),
	model: z.string().max(100).trim(),
	type: z.string().max(50).trim().default('bus'),
	capacity: z.number().int().positive().default(3500),
	status: z.enum(['available', 'on_route', 'repair']).default('available'),
});

export const updateCarSchema = z.object({
	plate: z
		.string()
		.max(20)
		.trim()
		.transform((val) => val.toUpperCase())
		.optional(),
	model: z.string().max(100).trim().optional(),
	type: z.string().max(50).trim().optional(),
	capacity: z.number().int().positive().optional(),
	status: z.enum(['available', 'on_route', 'repair']).optional(),
});

export type CreateCarDto = z.infer<typeof createCarSchema>;
export type UpdateCarDto = z.infer<typeof updateCarSchema>;
