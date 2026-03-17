export type RouteStatus =
	| 'planned'
	| 'in_progress'
	| 'completed'
	| 'pending_approval'
	| 'approved'
	| 'cancelled'
	| 'deleted';

export interface Route {
	id: number;
	date: string; // YYYY-MM-DD
	car_id: number;
	driver_id: number;
	start_location: string;
	end_location: string;
	route_number: string;

	planned_km: number;
	planned_hours: number;

	actual_km: number;
	actual_hours: number;

	notes: string | null;

	helper_name: string | null;

	status: RouteStatus;

	created_at: string;
	updated_at: string;
}

// export interface CreateRouteDto {
// 	date: string; // YYYY-MM-DD
// 	car_id: number;
// 	driver_id: number;
// 	start_location: string;
// 	end_location: string;
// 	route_number: string;
// 	planned_km?: number;
// 	planned_hours?: number;
// 	actual_km?: number;
// 	actual_hours?: number;
// 	notes?: string;
// 	helper_present?: boolean;
// 	status?: RouteStatus;
// }

// export interface UpdateRouteDto {
// 	date?: string;
// 	car_id?: number;
// 	driver_id?: number;
// 	start_location?: string;
// 	end_location?: string;
// 	route_number?: string;
// 	planned_km?: number;
// 	planned_hours?: number;
// 	actual_km?: number;
// 	actual_hours?: number;
// 	notes?: string | null;
// 	helper_present?: boolean;
// 	status?: RouteStatus;
// }
