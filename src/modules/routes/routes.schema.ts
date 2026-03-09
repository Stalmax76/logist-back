import { z } from 'zod';

export const RouteStatusEnum = z.enum([
	'planned',
	'in_progress',
	'completed',
	'approved',
	'cancelled',
	'deleted',
]);

export const createRouteSchema = z.object({
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
	car_id: z.number().int().positive(),
	driver_id: z.number().int().positive(),
	start_location: z.string().trim().min(1).max(255),
	end_location: z.string().trim().min(1).max(255),
	route_number: z.string().trim().min(1).max(50),
	planned_km: z.number().min(0).optional(),
	planned_hours: z.number().min(0).max(24).optional(),
	status: RouteStatusEnum.default('planned'),
});

export const updateRouteSchema = createRouteSchema.partial();

export type CreateRouteDto = z.infer<typeof createRouteSchema>;
export type UpdateRouteDto = z.infer<typeof updateRouteSchema>;
