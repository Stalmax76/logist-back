export interface RouteLog {
	id?: number;
	route_id: number;
	user_id: number;
	start_time: string;
	end_time: string;
	actual_hours?: number | null;
	status?: 'draft' | 'submitted' | 'approved' | 'cancelled' | 'delayed';
	distance_traveled: number | null;
	fuel_used?: number | null;
	notes?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
}
