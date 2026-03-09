import { z } from 'zod';

export const createCarSchema = z.object({
	plate: z.string().max(20).trim(),
	model: z.string().max(100).trim(),
	type: z.string().max(50).trim().optional(),
	capacity: z.number().int().positive(),
	status: z.enum(['available', 'on_route', 'repair']).default('available'),
});

export const updateCarSchema = createCarSchema.partial();

export type CreateCarDto = z.infer<typeof createCarSchema>;
export type UpdateCarDto = z.infer<typeof updateCarSchema>;
