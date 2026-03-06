export interface CalendarEntry {
	date: string; // YYYY-MM-DD
	type: 'work' | 'vacation' | 'day_off' | 'sick_leave';
	planned_hours: number;
	actual_hours: number;
	is_auto_generated: boolean;
	status: 'planned' | 'confirmed' | 'cancelled';
	notes?: string;

	// додаткові поля для календаря
	has_route?: boolean; // чи є маршрут у цей день
	route_id?: number | null;
	route_status?: string | null;

	overtime?: number; // якщо actual_hours > норми
}

export type Calendar = CalendarEntry[];
