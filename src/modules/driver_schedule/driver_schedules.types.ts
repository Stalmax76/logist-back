export interface DriverSchedule {
	id?: number;
	driver_id: number;
	date: string; // YYYY-MM-DD
	type: 'work' | 'vacation' | 'day_off' | 'sick_leave';
	planned_hours?: number;
	actual_hours?: number;
	notes?: string | null;
	is_auto_generated?: boolean;
	status: 'planned' | 'confirmed' | 'cancelled';
	created_at?: string;
	updated_at?: string;
}
