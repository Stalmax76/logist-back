export interface Route {
	id?: number;
	date: string; // YYYY-MM-DD
	car_id: number;
	driver_id: number;
	start_location: string;
	end_location: string;
	route_number: string;
	planned_km?: number;
	planned_hours?: number;
	status: 'planned' | 'in_progress' | 'completed' | 'approved' | 'cancelled' | 'deleted';

	created_at?: string;
	updated_at?: string;
}
