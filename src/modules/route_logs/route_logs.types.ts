import type { RouteStatus } from '../routes/route.types.ts';
import type { UserRole } from '../users/user.types.ts';

export type RouteLogActions =
	| 'create'
	| 'update'
	| 'driver_update'
	| 'status_change'
	| 'manager_approval'
	| 'manager_rejection'
	| 'delete';
export interface RouteLog {
	id?: number;
	route_id: number;
	user_id: number;
	user_role: UserRole;

	action: RouteLogActions;
	before_data?: Record<string, any> | null;
	after_data?: Record<string, any> | null;

	status_before?: RouteStatus | null;
	status_after?: RouteStatus | null;

	comment?: string | null;

	created_at?: string;
}
