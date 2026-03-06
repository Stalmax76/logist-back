export interface WorkHoursStats {
	total_hours: number; // фактичні години
	regular_hours: number; // години в межах норми
	overtime_hours: number; // переробка
	vacation_days: number;
	day_off_days: number;
	sick_leave_days: number;

	work_days: number; // кількість робочих днів
	route_hours: number; // години з маршрутів
	manual_hours: number; // години з ручних записів
	norm_hours: number; // норма за період
	difference: number; // total_hours - norm_hours
}
