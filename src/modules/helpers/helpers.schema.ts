import { z } from 'zod';

export const createHelperSchema = z.object({
	name: z.string().min(2),
	phone: z.string().optional(),
});

export const updateHelperSchema = z.object({
	name: z.string().min(2).optional(),
	phone: z.string().optional(),
});

export type CreateHelperDto = z.infer<typeof createHelperSchema>;
export type UpdateHelperDto = z.infer<typeof updateHelperSchema>;
