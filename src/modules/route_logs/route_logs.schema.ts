import { z } from 'zod';

import type { Route, RouteStatus } from '../routes/route.types.ts';
import type { UserRole } from '../users/user.types.ts';
import type { RouteLogActions } from './route_logs.types.ts';

export const RouteStatusEnum = z.enum([
	'planned',
	'in_progress',
	'completed',
	'pending_approval',
	'approved',
	'cancelled',
	'deleted',
] satisfies RouteStatus[]);

export const UserRoleEnum = z.enum(['driver', 'manager', 'admin'] satisfies UserRole[]);

export const RouteLogActionsEnum = z.enum([
	'create',
	'update',
	'driver_update',
	'status_change',
	'manager_approval',
	'manager_rejection',
	'delete',
] satisfies RouteLogActions[]);

export const createRouteLogSchema = z.object({
	route_id: z.number().int().positive(),
	user_id: z.number().int().positive(),
	user_role: UserRoleEnum,
	action: RouteLogActionsEnum,
	before_data: z.record(z.string(), z.any()).nullable().optional(),
	after_data: z.record(z.string(), z.any()).nullable().optional(),

	status_before: RouteStatusEnum.nullable().optional(),
	status_after: RouteStatusEnum.nullable().optional(),
	comment: z.string().max(2000).nullable().optional(),
});
export const updateRouteLogSchema = createRouteLogSchema.partial();
export type CreateRouteLogDto = z.infer<typeof createRouteLogSchema>;
export type UpdateRouteLogDto = z.infer<typeof updateRouteLogSchema>;
