import { z } from 'zod';

export const RouteStatusEnum = z.enum([
	'planned',
	'in_progress',
	'completed',
	'pending_approval',
	'approved',
	'cancelled',
	'deleted',
]);
export const statusSchema = z.object({
	status: z.string().min(1),
});

export const createRouteSchema = z.object({
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
	car_id: z.number().int().positive(),
	driver_id: z.number().int().positive(),
	start_location: z.string().trim().min(1).max(255),
	end_location: z.string().trim().min(1).max(255),
	route_number: z.string().trim().min(1).max(50),

	planned_km: z.number().min(0).optional(),
	planned_hours: z.number().min(0).max(24).optional(),

	actual_km: z.number().min(0).optional(),
	actual_hours: z.number().min(0).max(24).optional(),

	notes: z.string().trim().max(2000).nullable().optional(),
	helper_name: z.string().trim().max(100).nullable().optional(),
	status: RouteStatusEnum.default('planned'),
});

export const updateRouteSchema = z.object({
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(), // YYYY-MM-DD
	car_id: z.number().int().positive().optional(),
	driver_id: z.number().int().positive().optional(),
	start_location: z.string().trim().min(1).max(255).optional(),
	end_location: z.string().trim().min(1).max(255).optional(),
	route_number: z.string().trim().min(1).max(50).optional(),

	planned_km: z.number().min(0).optional(),
	planned_hours: z.number().min(0).max(24).optional(),

	actual_km: z.number().min(0).optional(),
	actual_hours: z.number().min(0).max(24).optional(),

	notes: z.string().trim().max(2000).nullable().optional(),
	helper_name: z.string().trim().max(100).nullable().optional(),
	status: RouteStatusEnum.optional(),
});

export type CreateRouteDto = z.infer<typeof createRouteSchema>;
export type UpdateRouteDto = z.infer<typeof updateRouteSchema>;
