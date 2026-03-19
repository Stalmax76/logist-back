import { createRouteLog } from './route_logs.service.ts';
import type { Route } from '../routes/route.types.ts';
import type { UserRole } from '../users/user.types.ts';
import type { RouteLogActions } from './route_logs.types.ts';

export async function logRouteChange(
	oldRoute: Route,
	newRoute: Route,
	user: { id: number; role: UserRole }
) {
	const changedFields: Record<string, { before: any; after: any }> = {};

	for (const key of Object.keys(newRoute) as (keyof Route)[]) {
		if (newRoute[key] !== oldRoute[key]) {
			changedFields[key] = {
				before: oldRoute[key],
				after: newRoute[key],
			};
		}
	}

	if (Object.keys(changedFields).length === 0) return null;

	let action: RouteLogActions = 'update';

	if (changedFields.status) {
		action = 'status_change';
		if (newRoute.status === 'approved') action = 'manager_approval';
		if (newRoute.status === 'cancelled') action = 'manager_rejection';
	}

	if (user.role === 'driver') action = 'driver_update';

	return createRouteLog({
		route_id: newRoute.id,
		user_id: user.id,
		user_role: user.role,
		action,
		before_data: Object.fromEntries(Object.entries(changedFields).map(([k, v]) => [k, v.before])),
		after_data: Object.fromEntries(Object.entries(changedFields).map(([k, v]) => [k, v.after])),
		status_before: changedFields.status?.before ?? null,
		status_after: changedFields.status?.after ?? null,
		comment: null,
	});
}
