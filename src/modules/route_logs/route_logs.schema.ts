import { z } from 'zod';

export const RouteLogStatusEnum = z.enum([
	'draft',
	'submitted',
	'approved',
	'cancelled',
	'delayed',
]);
export const createRouteLogSchema = z.object({
	route_id: z.number().int().positive(),
	user_id: z.number().int().positive(),
	start_time: z.string().datetime(), // ISO 8601
	end_time: z.string().datetime(),
	actual_hours: z.number().min(0).nullable().optional(),
	status: RouteLogStatusEnum.default('draft'),
	distance_traveled: z.number().min(0).nullable().optional(),
	fuel_used: z.number().min(0).nullable().optional(),
	notes: z.string().max(500).nullable().optional(),
});
export const updateRouteLogSchema = createRouteLogSchema.partial();
export type CreateRouteLogDto = z.infer<typeof createRouteLogSchema>;
export type UpdateRouteLogDto = z.infer<typeof updateRouteLogSchema>;
